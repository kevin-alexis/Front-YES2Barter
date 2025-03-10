import { PropuestaIntercambioService } from '../services/propuesta-intercambio/PropuestaIntercambioService.ts'
import type { IPropuestaIntercambio } from '../interfaces/propuestaIntercambio/IPropuestaIntercambio.ts'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import Swal from 'sweetalert2'
import router from '@/router'
import { useRoute } from 'vue-router'

export const usePropuestaIntercambioStore = defineStore('propuesta intercambio', () => {
  const service = new PropuestaIntercambioService()
  const list: Ref<IPropuestaIntercambio[]> = ref([])
  const route = useRoute()

  async function getAll() {
    try {
      const response = await service.getAll()
      list.value = await response
    } catch (error) {
      console.error(error)
    }
  }

  async function getAllByIdObjeto(id: string) {
    try {
      const response = await service.GetAllByIdObjeto(id)
      list.value = await response.data
    } catch (error) {
      console.error(error)
    }
  }

  async function create(item: any) {
    try {
      const response = await service.createPropuestaIntercambio(item).then((response) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'La propuesta de intercambio ha sido añadida exitosamente a la lista.',
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
      const response = await service.updatePropuestaIntercambio(id, item).then(() => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'La propuesta de intercambio ha sido editada exitosamente.',
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
              const idObjeto = route.params.id as string
              await getAllByIdObjeto(idObjeto)
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

  return { list, getAll, getById, getAllByIdObjeto, deleteItem, create, update }
})
