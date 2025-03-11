import { PropuestaIntercambioService } from '../services/propuesta-intercambio/PropuestaIntercambioService.ts'
import type { IPropuestaIntercambio } from '../interfaces/propuestaIntercambio/IPropuestaIntercambio.ts'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import Swal from 'sweetalert2'
import router from '@/router'
import { useRoute } from 'vue-router'
import { LogService } from '@/services/log/LogService'

export const usePropuestaIntercambioStore = defineStore('propuesta intercambio', () => {
  const service = new PropuestaIntercambioService()
  const logService = new LogService()
  const list: Ref<IPropuestaIntercambio[]> = ref([])
  const route = useRoute()

  async function getAll() {
    try {
      const response = await service.getAll()
      list.value = await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAll del store propuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function getAllPropuestas() {
    try {
      const response = await service.getAllPropuestas()
      list.value = await response.data
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllPropuestas del store propuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function getAllByIdObjeto(id: string) {
    try {
      const response = await service.GetAllByIdObjeto(id)
      list.value = await response.data
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllByIdObjeto del store propuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
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
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método create del store propuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
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
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método update del store propuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
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
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método deleteItem del store propuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function getById(id: string) {
    try {
      const response = await service.getById(id)
      return await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getById del store propuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  return { list, getAll, getAllPropuestas, getById, getAllByIdObjeto, deleteItem, create, update }
})
