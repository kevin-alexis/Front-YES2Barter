import { defineStore } from 'pinia'
import { ref } from 'vue'

export class baseStore {
  protected nombre: string

  constructor(nombre: string) {
    this.nombre = nombre
  }

  public static createStore(nombre: string) {
    return defineStore(nombre, () => {
      const list = ref([])
      return { list }
    })
  }
}
