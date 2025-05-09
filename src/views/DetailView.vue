<template>
  <div class="detail">
    <div v-if="brewery">
      <h1>{{ brewery.name }}</h1>
      <p><strong>Type:</strong> <TypeBadge :brewery-type="brewery.brewery_type" /></p>
      <p><strong>Address:</strong> {{ brewery.street }}, {{ brewery.city }}, {{ brewery.state }}</p>

      <p>
        <strong>Website:</strong>
        &nbsp;<a :href="brewery.website_url" target="_blank">{{ brewery.website_url }}</a>
      </p>
      <p><strong>Phone Number:</strong> {{ formattedPhoneNumber }}</p>
      <br /><br />
      <router-link to="/"> Back to List </router-link>
    </div>
    <div v-else>
      <h3>Loading brewery details...</h3>
    </div>

    <div v-if="error">
      <h3>{{ error }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import TypeBadge from '../components/TypeBadge.vue'

const brewery = ref(null)
const route = useRoute()
const error = ref(null)

const formattedPhoneNumber = computed(() => {
  const phone = brewery.value?.phone || null
  if (!phone) return 'N/A'
  const cleaned = phone.replace(/\D/g, '') // Remove non-numeric characters
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone
})

const fetchBreweryDetails = async () => {
  const breweryId = route.params.id

  let apiUrl = `https://api.openbrewerydb.org/v1/breweries/${breweryId}`
  if (breweryId === 'random') {
    apiUrl = `https://api.openbrewerydb.org/v1/breweries/random`
  }

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    brewery.value = Array.isArray(data) ? data[0] : data
  } catch (error) {
    error.value = 'Failed to load brewery details. Please try again later.'
    console.error('Error fetching brewery details:', error)
  }
}

onMounted(() => {
  fetchBreweryDetails()
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

.detail {
  text-align: center;
}
</style>
