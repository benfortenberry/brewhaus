import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    searchQuery: '',
  }),
  actions: {
    setSearchQuery(newQuery: string) {
      this.searchQuery = newQuery
    },
    clearSearchQuery() {
      this.searchQuery = ''
    },
  },
})
