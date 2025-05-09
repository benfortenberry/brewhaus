<template>
  <ul>
    <li v-for="brewery in props.breweries" :key="brewery.id">
      <router-link :to="{ name: 'detail', params: { id: brewery.id } }">
        <div class="brewery-card">
          <div class="row">
            <div class="col-6">
              <h3>{{ brewery.name }}</h3>

              <p><TypeBadge :brewery-type="brewery.brewery_type" /></p>
            </div>

            <div class="col-6">
              <p>{{ brewery.address_1 }}</p>
              <p>{{ brewery.city }}, {{ brewery.state }}</p>
            </div>
          </div>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import TypeBadge from '../components/TypeBadge.vue'

const props = defineProps({
  breweries: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
ul {
  list-style-type: none;
}

a {
  text-decoration: none;
  color: inherit;
}
.brewery-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.brewery-item {
  margin: 0;
}

.brewery-link {
  text-decoration: none;
  color: inherit;
}

.brewery-card {
  background-color: #fee68c;
  background-image: url(../assets/right-arrow.png);
  background-size: 20px 20px;
  background-position: right 2% bottom 45%;
  background-repeat: no-repeat;
  opacity: 0.9;
  border: 2px solid #4a200b;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.brewery-card:hover {
  opacity: 1;
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.brewery-card h3 {
  color: #4a200b;
  padding-left: 20px;
}

.brewery-card p {
  color: #5b280e;
  padding-left: 20px;
}

.arrow {
  text-align: right;
}
</style>
