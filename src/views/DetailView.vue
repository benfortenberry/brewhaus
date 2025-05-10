<template>
  <div class="detail">
    <div v-if="brewery">
      <div class="row">
        <div class="col-6">
          <h1>{{ brewery.name }}</h1>
          <p><strong>Type:</strong> <TypeBadge :brewery-type="brewery.brewery_type" /></p>
          <p>
            <strong>Address:</strong> {{ brewery.street }}, {{ brewery.city }}, {{ brewery.state }}
          </p>

          <p>
            <strong>Website:</strong>
            &nbsp;<a :href="brewery.website_url" target="_blank">{{ brewery.website_url }}</a>
          </p>
          <p><strong>Phone Number:</strong> {{ formattedPhoneNumber }}</p>
          <br /><br />
          <router-link to="/"> Back to List </router-link>
        </div>

        <div class="col-6">
          <GoogleMap :api-key="mapKey" class="map" :center="center" :zoom="15">
            <Marker :options="{ position: center }" />
          </GoogleMap>
        </div>
      </div>
    </div>
    <div v-else>
      <h3>Loading brewery details...</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import TypeBadge from '../components/TypeBadge.vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import type { Brewery } from '@/types/brewery'

const brewery = ref<Brewery | null>(null)
const route = useRoute()

const mapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const formattedPhoneNumber = computed(() => {
  const phone = brewery.value?.phone || null
  if (!phone) return 'N/A'
  const cleaned = phone.replace(/\D/g, '') // Remove non-numeric characters
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone
})

const center = computed(() => {
  return {
    lat: brewery.value?.latitude,
    lng: brewery.value?.longitude,
  }
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
  } catch (e) {
    console.error('Error fetching brewery details:', e)
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

.map {
  width: 100%;
  height: 400px;
}
</style>
