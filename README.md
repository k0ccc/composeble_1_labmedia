[Можно попробывать тут!](https://k0ccc.github.io/composeble_1_labmedia/)

# composeble_1_labmedia

Задания на проектирование и реализацию правил валидации

1. Написать универсальный composable на Vue и TS для валидации форм. Основная его задача, проверять данные формы по заданным правилам (список полей и правила для каждого поля - входные данные) и возвращать реактивное состояние валидности формы, состояние каждого поля формы (Структуру для входных данных придумать самостоятельно). Необходимо учитывать что поля могут быть любыми и их может быть любое количество.

2. Написать универсальный composable на Vue и TS для обращения к API по HTTP. Принимает в себя необходимые параметры для http запроса (адрес, метод, заголовки, тело запроса и т.д.), возвращает реактивные данные запроса, реактивный статус, реактивные состояния загрузки, успеха, ошибки.

Примечание - Условно, может быть форма (любое количество полей, каждому полю любое количество правил.). Список полей и правил - это входные данные.

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
