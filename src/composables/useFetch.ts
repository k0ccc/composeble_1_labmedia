import { ref, isRef, watch, computed, unref, type Ref } from 'vue'
// Вспомогательный тип для приёма как ref, так и обычных значений
type MaybeRef<T> = T | Ref<T>

// Опции запроса, расширяющие стандартный RequestInit
export interface UseFetchOptions extends Omit<RequestInit, 'body'> {
  // Позволяем передавать в body объект, который будет автоматически преобразован в JSON
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: MaybeRef<Record<string, any> | BodyInit | null>
  // Управляет немедленным выполнением запроса при создании composable
  immediate?: boolean
}

// Кастомный класс ошибки для удобной работы с ответом сервера
export class HTTPError extends Error {
  response: Response
  constructor(response: Response) {
    super(`HTTP error! status: ${response.status}`)
    this.name = 'HTTPError'
    this.response = response
  }
}

/**
 * Универсальный composable для HTTP-запросов.
 * @param url - URL для запроса (может быть ref).
 * @param options - Опции запроса, аналогичные fetch() (могут быть ref).
 * @returns Реактивные состояния и функция для выполнения запроса.
 */
export function useFetch<T>(url: MaybeRef<string>, options: MaybeRef<UseFetchOptions> = {}) {
  // Реактивное состояние для хранения данных
  const data = ref<T | null>(null)
  // Реактивное состояние для HTTP статуса ответа
  const status = ref<number | null>(null)
  // Реактивное состояние для хранения ошибки
  const error = ref<Error | null>(null)
  // Реактивное состояние процесса загрузки
  const isLoading = ref<boolean>(false)
  // Реактивное состояние успешного выполнения запроса
  const isSuccess = ref<boolean>(false)

  // Функция для выполнения запроса
  const execute = async () => {
    // Сброс состояний перед каждым запросом
    isLoading.value = true
    isSuccess.value = false
    error.value = null
    data.value = null

    try {
      const resolvedUrl = isRef(url) ? url.value : url
      const resolvedOptions = isRef(options) ? options.value : options

      const headers = new Headers(resolvedOptions.headers)

      let body = isRef(resolvedOptions.body) ? resolvedOptions.body.value : resolvedOptions.body

      // Автоматически преобразуем тело запроса в JSON и устанавливаем заголовок
      if (
        body &&
        typeof body === 'object' &&
        !(body instanceof Blob) &&
        !(body instanceof FormData) &&
        !headers.has('Content-Type')
      ) {
        headers.set('Content-Type', 'application/json')
        const unwrappedBody = Object.fromEntries(
          Object.entries(body).map(([key, value]) => [key, unref(value)]),
        )

        body = JSON.stringify(unwrappedBody)
      }

      const response = await fetch(resolvedUrl, {
        ...resolvedOptions,
        headers,
        body: body as BodyInit | null,
      })

      status.value = response.status

      // Если ответ не успешный (не в диапазоне 200-299), выбрасываем ошибку
      if (!response.ok) {
        throw new HTTPError(response)
      }

      // Обрабатываем ответы без тела (например, 204 No Content)
      if (response.status === 204) {
        data.value = null
      } else {
        data.value = await response.json()
      }

      isSuccess.value = true
    } catch (e: unknown) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      isLoading.value = false
    }
  }

  // Логика для немедленного запуска
  const immediate = (isRef(options) ? options.value : options).immediate ?? true
  if (immediate) {
    execute()
  }

  // Если URL или опции являются ref, следим за их изменениями и перезапускаем запрос
  if (isRef(url) || isRef(options)) {
    watch(
      [
        computed(() => (isRef(url) ? url.value : url)),
        computed(() => (isRef(options) ? options.value : options)),
      ],
      () => {
        if (!immediate) return // Не перезапускаем, если immediate = false
        execute()
      },
      { deep: true },
    )
  }

  return {
    data,
    status,
    error,
    isLoading,
    isSuccess,
    execute,
  }
}
