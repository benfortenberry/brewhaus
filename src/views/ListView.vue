<template>
  <div>
    <h2>
      Willkommen! Below you'll find a listing of the finest breweries. Or try your luck with a

      <router-link to="/detail/random">random brewery</router-link>.
    </h2>

    <br />

    <div class="search-container">
      <input
        type="text"
        placeholder="Search breweries..."
        class="search-input"
        v-model="searchQuery"
        @input="debouncedSearch"
      />
      <button v-if="searchQuery" class="clear-button" @click="clearSearch">Clear</button>
    </div>
    <br />
    <h3 v-if="!loading && breweries.length == 0">No Breweries found.</h3>
    <ListItems :breweries="breweries" />

    <h3 v-if="loading" class="loading">Loading more breweries...</h3>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import debounce from 'lodash.debounce'
import ListItems from '../components/ListItems.vue'
import type { Brewery } from '@/types/brewery'

const breweries = ref<Brewery[]>([])
const page = ref(1)
const searchQuery = ref('')
const perPage = ref(10)
const loading = ref(false)
const hasMore = ref(true)

const fetchBreweries = () => {
  if (loading.value || !hasMore.value) return

  loading.value = true

  const apiUrl = searchQuery.value
    ? `https://api.openbrewerydb.org/v1/breweries/search?query=${searchQuery.value}&page=${page.value}&per_page=${perPage.value}`
    : `https://api.openbrewerydb.org/v1/breweries?page=${page.value}&per_page=${perPage.value}`

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.length < perPage.value) {
        hasMore.value = false // No more items to load
      }
      breweries.value = [...breweries.value, ...data]
      page.value += 1
      loading.value = false
    })
    .catch((error) => {
      console.error('Error fetching breweries:', error)
      loading.value = false
    })
}

const debouncedSearch = debounce(() => {
  if (searchQuery.value.length < 3 && searchQuery.value.length > 0) {
    return
  }
  page.value = 1
  breweries.value = []
  hasMore.value = true
  fetchBreweries()
}, 300)

const clearSearch = () => {
  searchQuery.value = ''
  breweries.value = []
  hasMore.value = true
  page.value = 1
  fetchBreweries()
}

// Infinite scroll handler
const handleScroll = () => {
  if (!hasMore.value || loading.value) return

  const scrollPosition = window.innerHeight + window.scrollY
  const bottomPosition = document.documentElement.offsetHeight - 100

  if (scrollPosition >= bottomPosition) {
    fetchBreweries()
  }
}

onMounted(() => {
  fetchBreweries()
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
a {
  text-decoration: underline !important;
  transition: color 0.3s ease;
}

a:hover {
  color: white;
}
.search-container {
  display: flex;
  align-items: center;
  position: relative;
}

input[type='text'],
button {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  border: 1px transparent;
  padding-left: 5px;
  padding-right: 5px;
  outline: none;
}

input[type='text']:focus {
  background-color: white;
}

.search-input {
  background-color: #fee68c;
  width: 50vw;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.clear-button {
  background-color: #fa872b;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.clear-button:hover {
  background-color: #e37c27;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 2rem;
}
h2 {
  text-align: center;
}
</style>
