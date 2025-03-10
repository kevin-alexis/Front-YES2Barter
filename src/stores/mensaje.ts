import type { IMensaje } from './../interfaces/mensaje/IMensaje'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import Swal from 'sweetalert2'
import router from '@/router'
import { MensajeService } from '@/services/mensaje/MensajeService'
import { LogService } from '@/services/log/LogService'

export const useMensajeStore = defineStore('mensaje', () => {
  const service = new MensajeService()
  const logService = new LogService()
  const list: Ref<IMensaje[]> = ref([])

  async function getAll() {
    try {
      const response = await service.getAll()
      list.value = await response
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

  async function getAllByIdChat(idChat: number) {
    try {
      const response = await service.getAllByIdChat(idChat)
      if (
        !response.success &&
        [
          'El usuario no tiene permisos para acceder a este chat.',
          'Chat no encontrado',
          'Usuario no autenticado',
        ].includes(response.message)
      ) {
        router.replace({ name: 'chat' })
      }
      list.value = await response.data
    } catch (error) {
      console.error(error)
    }
  }

  async function create(item: any) {
    try {
      const response = await service.create(item).then(() => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El mensaje ha sido añadida exitosamente a la lista.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6C6DE7',
        }).then(() => {
          router.replace({ name: 'administrar mensajes' })
        })
      })
      return await response
    } catch (error) {
      console.error(error)
    }
  }

  async function update(id: string, item: any) {
    try {
      const response = await service.update(id, item).then(() => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El mensaje ha sido editado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6C6DE7',
        }).then(() => {
          router.replace({ name: 'administrar mensajes' })
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

  return { list, getAll, getById, getAllByIdChat, deleteItem, create, update }
})
