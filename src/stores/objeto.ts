import type { IObjeto } from '../interfaces/objeto/IObjeto'
import { ObjetoService } from '../services/objeto/ObjetoService'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import Swal from 'sweetalert2'
import router from '@/router'
import { useRoute } from 'vue-router'

export const useObjetoStore = defineStore('objeto', () => {
  const service = new ObjetoService()
  const list: Ref<IObjeto[]> = ref([])
  const route = useRoute()

  async function getAll() {
    try {
      const response = await service.getAll()
      list.value = await response
    } catch (error) {
      console.error(error)
    }
  }

  async function getByName(name: string) {
    try {
      const response = await service.GetByName(name)
      console.error(response)
      list.value = await response.data
    } catch (error) {
      console.error(error)
    }
  }

  async function getAllByIdCategoria(id: string) {
    try {
      const response = await service.GetAllByIdCategoria(id)
      list.value = await response.data
    } catch (error) {
      console.error(error)
    }
  }

  async function create(item: any) {
    try {
      const response = await service.createObjeto(item).then(() => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El objeto ha sido añadido exitosamente a la lista.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6C6DE7',
        }).then(() => {
          router.back()
        })
      })
      return await response
    } catch (error) {
      console.error(error)
    }
  }

  async function update(id: string, item: any) {
    try {
      const response = await service.updateObjeto(id, item).then(() => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El objeto ha sido editado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6C6DE7',
        }).then(() => {
          router.back()
        })
      })
      return await response
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteItem(id: number) {
    try {
      Swal.fire({
        title: '¿Estas seguro?',
        text: 'No podras revertirlo!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await service
            .delete(id)
            .then(async () => {
              Swal.fire({
                title: 'Eliminar!',
                text: 'El registro fue eliminado.',
                icon: 'success',
              })
              await getAll()
              const idCategoria = route.params.id as string
              getAllByIdCategoria(idCategoria)
            })
            .catch((error) => {
              Swal.fire({
                title: 'No se pudo elimnar!',
                text: `El registro no fue eliminado ${error}.`,
                icon: 'error',
              })
            })
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function getById(id: string) {
    try {
      const response = await service.getById(id)
      return await response
    } catch (error) {
      console.error(error)
    }
  }

  return { list, getAll, getById, getByName, getAllByIdCategoria, deleteItem, create, update }
})
