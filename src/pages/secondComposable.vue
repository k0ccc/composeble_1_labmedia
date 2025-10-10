<template>
  <div>
    <h2>Посты (GET-запрос)</h2>

    <div v-if="isLoading">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="error">
      <p>Ошибка при загрузке: {{ error.message }}</p>
    </div>

    <ul v-else-if="data">
      <li v-for="post in data" :key="post.id">
        {{ post.title }}
      </li>
    </ul>

    <hr />

    <h2>Создать новый пост (POST-запрос)</h2>
    <form @submit.prevent="createPost">
      <input type="text" v-model="newPostTitle" placeholder="Заголовок поста" />
      <button type="submit" :disabled="createPostState.isLoading.valueOf()">
        {{ createPostState.isLoading.valueOf() ? 'Отправка...' : 'Создать' }}
      </button>
    </form>

    <div v-if="createPostState.isSuccess.valueOf()">
      <p>Пост успешно создан! ID: {{ createPostState.data?.id }}</p>
    </div>
    <div v-if="createPostState.error">
      <p>Ошибка создания: {{ createPostState.error.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useFetch } from '@/composables/useFetch'

// --- Типы для данных ---
interface Post {
  id: number
  userId: number
  title: string
  body: string
}

// --- Пример 1: GET-запрос, который выполняется сразу ---
const { data, error, isLoading } = useFetch<Post[]>(
  'https://jsonplaceholder.typicode.com/posts?_limit=5',
)

// --- Пример 2: POST-запрос, который выполняется вручную ---
const newPostTitle = ref('')

// Используем reactive для группировки состояний, так удобнее
const createPostState = reactive(
  useFetch<{ id: number }>('https://jsonplaceholder.typicode.com/posts', {
    // Запрос не будет выполнен сразу
    immediate: false,
    method: 'POST',
    // Тело будет автоматически преобразовано в JSON
    body: {
      title: newPostTitle, // Можно передавать ref прямо в тело
      body: 'Это тело нового поста.',
      userId: 1,
    },
  }),
)

const createPost = async () => {
  // Запускаем запрос вручную
  await createPostState.execute()

  // Опционально: очищаем поле после успеха
  if (createPostState.isSuccess.valueOf()) {
    newPostTitle.value = ''
  }
}
</script>

<style scoped>
hr {
  margin: 20px 0;
}
p {
  margin: 5px 0;
}
ul {
  padding-left: 20px;
}
div {
  margin-bottom: 10px;
}
form {
  display: flex;
  gap: 10px;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
