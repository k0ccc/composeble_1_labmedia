/* eslint-disable @typescript-eslint/no-explicit-any */
// composables/useFormValidation.ts

import { reactive, computed, watch } from 'vue'

// --- ТИПЫ ---

/**
 * Функция-валидатор.
 * @param value - Значение поля для проверки.
 * @returns {true | string} - true, если валидация прошла, иначе строку с ошибкой.
 */
export type ValidationRule = (value: any) => true | string

/**
 * Объект правил валидации для формы.
 * Ключи - это имена полей из состояния формы.
 * Значения - массив правил (ValidationRule) для соответствующего поля.
 */
export type FormRules<T extends object> = {
  [K in keyof T]?: ValidationRule[]
}

/**
 * Объект с ошибками валидации.
 * Ключи - имена полей.
 * Значения - массив строк с текстами ошибок для поля.
 */
type FormErrors<T extends object> = {
  [K in keyof T]?: string[]
}

// --- COMPOSABLE ---

/**
 * Универсальный composable для валидации форм в Vue 3.
 * @param formState - Реактивное состояние формы (созданное через reactive или ref).
 * @param rules - Объект с правилами валидации.
 */
export function useFormValidation<T extends object>(formState: T, rules: FormRules<T>) {
  // Реактивный объект для хранения ошибок каждого поля
  const errors = reactive<FormErrors<T>>({})

  /**
   * Основная функция валидации. Проходит по всем правилам,
   * применяет их к текущему состоянию формы и обновляет объект errors.
   * @returns {boolean} - true, если вся форма валидна, иначе false.
   */
  const validate = (): boolean => {
    // Очищаем старые ключи, чтобы не хранить ошибки для полей, которых больше нет
    Object.keys(errors).forEach((key) => delete (errors as any)[key as keyof T])

    let isAllValid = true

    // Проходим по каждому полю, для которого заданы правила
    for (const fieldKey in rules) {
      const key = fieldKey as keyof T
      const fieldRules = rules[key]
      const value = formState[key]

      if (!fieldRules)
        continue

        // Инициализируем массив ошибок для текущего поля
      ;(errors as any)[key] = []

      // Применяем каждое правило к значению поля
      for (const rule of fieldRules) {
        const result = rule(value)
        if (typeof result === 'string') {
          // Если правило вернуло строку, это ошибка
          ;(errors as any)[key]?.push(result)
          isAllValid = false
        }
      }
    }
    return isAllValid
  }

  // Вычисляемое свойство, которое показывает, валидна ли форма в целом.
  // Зависит от объекта errors.
  const isFormValid = computed(() => {
    return Object.values(errors).every((errorArray) => !errorArray || errorArray.length === 0)
  })

  // Следим за изменениями в состоянии формы и автоматически запускаем валидацию.
  // deep: true - чтобы отслеживать изменения внутри объекта.
  watch(formState, validate, { deep: true })

  // Запускаем первую валидацию при инициализации
  validate()

  // Возвращаем реактивные данные и функцию для использования в компоненте
  return {
    errors,
    isFormValid,
    validate,
  }
}
