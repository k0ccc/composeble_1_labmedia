<template>
  <h1>Hello App!</h1>
  <nav>
    <RouterLink to="/first">Первый Composable</RouterLink>
    <RouterLink to="/second">Второй Composable</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>

<style lang="css" scoped>
* {
  max-width: 500px;
  margin: auto;
}
a {
  padding-right: 10px;
}
</style>
