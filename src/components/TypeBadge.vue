<template>
  <span :class="['type-badge', badgeClass]">
    {{ formattedType }}
  </span>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  breweryType: {
    type: String,
    required: true,
  },
})

const badgeClass = computed(() => {
  switch (props.breweryType.toLowerCase()) {
    case 'micro':
      return 'badge-micro'
    case 'nano':
      return 'badge-nano'
    case 'regional':
      return 'badge-regional'
    case 'brewpub':
      return 'badge-brewpub'
    case 'large':
      return 'badge-large'
    default:
      return 'badge-default'
  }
})

// Format the type for display
const formattedType = computed(() => {
  return props.breweryType.charAt(0).toUpperCase() + props.breweryType.slice(1)
})
</script>

<style scoped>
.type-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: capitalize;
  color: #fff;
}

.badge-micro {
  background-color: #be5b50;
}

.badge-nano {
  background-color: #8a2d3b;
}

.badge-regional {
  background-color: #a86523;
}

.badge-brewpub {
  background-color: #4a102a;
}

.badge-large {
  background-color: #641b2e;
}

.badge-default {
  background-color: #604652;
}
</style>
