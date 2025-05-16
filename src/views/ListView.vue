<template>
  <div>
    <h2>
      Willkommen! Below you'll find a listing of the finest breweries.
      <br />
      <a href="#" @click="getLocation">Find breweries in your area</a>
      or try your luck with a

      <router-link to="/detail/random">random brewery</router-link>.
    </h2>

    <br />
    <div class="search-container">
      <label for="search">Search: &nbsp;</label>
      <input type="text" placeholder="Enter a search term..." class="search-input" v-model="searchQuery"
        @input="debouncedSearch" />
      <button v-if="searchQuery" class="button clear-search" @click="clearSearch">Clear</button>
    </div>
    <br />
    <h3 v-if="!loading && breweries.length == 0">No Breweries found.</h3>
    <h3 v-if="filteredByLocation && breweries.length > 0">
      Breweries near you: <button class="button clear-filter" @click="clearSearch">Clear</button>
    </h3>
    <ListItems :breweries="breweries" />

    <h3 v-if="loading" class="loading">Loading breweries...</h3>
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
const filteredByLocation = ref(false)
const lat = ref(0)
const lon = ref(0)

const fetchBreweries = () => {
  if (loading.value || !hasMore.value) return

  loading.value = true

  let apiUrl = '';

  if (searchQuery.value) {
    apiUrl = `https://api.openbrewerydb.org/v1/breweries/search?query=${searchQuery.value}&page=${page.value}&per_page=${perPage.value}`
  }
  else if (filteredByLocation.value) {
    apiUrl = `https://api.openbrewerydb.org/v1/breweries?by_dist=${lat.value},${lon.value}`
  } else {
    apiUrl = `https://api.openbrewerydb.org/v1/breweries?page=${page.value}&per_page=${perPage.value}`
  }

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

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lat.value = position.coords.latitude
      lon.value = position.coords.longitude
      breweries.value = []
      filteredByLocation.value = true
      fetchBreweries()

    })
  } else {
    alert('Geolocation is not supported by this browser.')
  }
}

const debouncedSearch = debounce(() => {
  if (searchQuery.value.length < 3 && searchQuery.value.length > 0) {
    return
  }
  page.value = 1
  breweries.value = []
  hasMore.value = true
  filteredByLocation.value = false
  fetchBreweries()
}, 300)

const clearSearch = () => {
  searchQuery.value = ''
  breweries.value = []
  hasMore.value = true
  page.value = 1
  filteredByLocation.value = false
  fetchBreweries()
}

// Infinite scroll handler
const handleScroll = () => {
  if (!hasMore.value || loading.value) return

  const scrollPosition = window.innerHeight + window.scrollY
  const bottomPosition = document.documentElement.offsetHeight - 100

  if (scrollPosition >= bottomPosition) {

    if (!filteredByLocation.value) {

      fetchBreweries()
    }
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

.button {
  background-color: #fa872b;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.clear-search {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.clear-filter {
  margin-bottom: 5px;
}

.button:hover {
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
