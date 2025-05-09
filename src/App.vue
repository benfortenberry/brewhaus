<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="container">
    <header>
      <h1>
        <img src="./assets/beer-mug.svg" alt="Logo" class="logo" />
        Brewhaus
      </h1>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fee68c;
  margin-bottom: 0;
  padding: 0;
}

h1 {
  font-size: clamp(16px, 13vw, 200px);

  font-weight: 400;
  margin: 0;
  display: flex;
  align-items: center;
}

h1 img {
  margin-right: 1rem;
}

a {
  color: #fee68c;
  text-decoration: none;
  font-size: 1rem;
  margin-left: 0rem;
  transition: color 0.3s ease;
}

.logo {
  width: 10vw;
  transform: rotate(10deg);
}
</style>
