
import { defineStore } from 'pinia'
export const useStore = defineStore('counter', {
  state: () => ({
    admin: false
  }),
  actions: {
    set() {
      this.admin = true
    }
  },
})