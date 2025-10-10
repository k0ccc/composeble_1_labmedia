<template>
  <div class="form-container">
    <h2>Регистрация</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-field">
        <label for="name">Имя:</label>
        <input id="name" type="text" v-model="form.name" />
        <div v-if="errors.name?.length" class="error-messages">
          <p v-for="error in errors.name" :key="error">{{ error }}</p>
        </div>
      </div>

      <div class="form-field">
        <label for="email">Email:</label>
        <input id="email" type="email" v-model="form.email" />
        <div v-if="errors.email?.length" class="error-messages">
          <p v-for="error in errors.email" :key="error">{{ error }}</p>
        </div>
      </div>

      <div class="form-field">
        <label for="password">Пароль:</label>
        <input id="password" type="password" v-model="form.password" />
        <div v-if="errors.password?.length" class="error-messages">
          <p v-for="error in errors.password" :key="error">{{ error }}</p>
        </div>
      </div>

      <div class="form-field">
        <label for="age">Возраст (необязательно):</label>
        <input id="age" type="number" v-model.number="form.age" />
        <div v-if="errors.age?.length" class="error-messages">
          <p v-for="error in errors.age" :key="error">{{ error }}</p>
        </div>
      </div>

      <button type="submit" :disabled="!isFormValid">Зарегистрироваться</button>
    </form>

    <div class="debug-info">
      <h3>Состояние валидации:</h3>
      <pre>Форма валидна: {{ isFormValid }}</pre>
      <pre>Ошибки: {{ errors }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useFormValidation, type FormRules } from '@/composables/useFormValidation'

// 1. Определяем реактивное состояние формы
const form = reactive({
  name: '',
  email: '',
  password: '',
  age: null as number | null,
})

// 2. Определяем правила валидации для полей формы
const rules: FormRules<typeof form> = {
  name: [
    (v: string) => (!!v && v.trim() !== '') || 'Имя обязательно для заполнения.',
    (v: string) => v.length >= 2 || 'Имя должно содержать минимум 2 символа.',
  ],
  email: [
    (v: string) => !!v || 'Email обязателен.',
    (v: string) => /.+@.+\..+/.test(v) || 'Введите корректный email адрес.',
  ],
  password: [
    (v: string) => !!v || 'Пароль не может быть пустым.',
    (v: string) => v.length >= 8 || 'Пароль должен быть не менее 8 символов.',
    (v: string) => /[A-Z]/.test(v) || 'Пароль должен содержать хотя бы одну заглавную букву.',
    (v: string) => /[0-9]/.test(v) || 'Пароль должен содержать хотя бы одну цифру.',
  ],
  age: [
    // Правило сработает только если поле не пустое
    (v: number | null) => v === null || v >= 18 || 'Вам должно быть не менее 18 лет.',
  ],
}

// 3. Подключаем composable
const { errors, isFormValid, validate } = useFormValidation(form, rules)

// 4. Обработчик отправки формы
const handleSubmit = () => {
  // Дополнительно можно вызвать validate() для 100% уверенности,
  // хотя форма и так не отправится из-за :disabled
  if (validate()) {
    alert('Форма успешно отправлена!')
    console.log('Данные формы:', form)
  } else {
    alert('Пожалуйста, исправьте ошибки в форме.')
  }
}
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.form-field {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.error-messages p {
  color: red;
  font-size: 0.9em;
  margin: 5px 0 0;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.debug-info {
  margin-top: 20px;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
