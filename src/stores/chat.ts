import type { IChat } from './../interfaces/chat/IChat'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import Swal from 'sweetalert2'
import router from '@/router'
import { ChatService } from '@/services/chat/ChatService'
import { LogService } from '@/services/log/LogService'
import { useToast } from 'primevue/usetoast'
import { useAccountStore } from './account'

export const useChatStore = defineStore('chat', () => {
  const service = new ChatService()
  const logService = new LogService()
  const list: Ref<IChat[]> = ref([])
  const toast = useToast()
  const accountStore = useAccountStore()
  async function getAll() {
    try {
      const response = await service.getAll()
      list.value = await response
    } catch (error) {
      console.error(error)
    }
  }

  async function getAllByIdUsuario(id: string) {
    try {
      const response = await service.getAllByIdUsuario(id)
      list.value = await response.data
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllByIdUsuario del store chat: ${error.message}`,
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
        mensaje: `Error en el método getById del store chat: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function create(item: any) {
    try {
      const response = await service.create(item).then(() => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El chat ha sido añadida exitosamente a la lista.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6C6DE7',
        }).then(() => {
          router.replace({ name: 'administrar chats' })
        })
      })
      return await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método create del store chat: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function update(id: string, item: any) {
    try {
      const response = await service.update(id, item).then(() => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'El chat ha sido editado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6C6DE7',
        }).then(() => {
          router.replace({ name: 'administrar chats' })
        })
      })
      return await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método update del store chat: ${error.message}`,
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
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método deleteItem del store chat: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function closeChat(isSuccess: boolean, idChat: number) {
    try {
      if (isSuccess === false) {
        Swal.fire({
          title: '¿Estás seguro de cerrar el chat?',
          text: 'No podrás revertirlo!',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cerrar!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            await service.closeChat(isSuccess, idChat);
            Swal.fire({
              title: 'Cerrar!',
              text: 'El chat ha sido cerrado.',
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#6C6DE7',
            });
            toast.add({ severity: 'info', summary: 'Éxito', detail: '¡Haz cerrado el chat, intercambio no concretado!', life: 2000 });
            getAllByIdUsuario(accountStore?.user?.idUsuario ?? "")
          }
        });
      } else if (isSuccess === true) {
        Swal.fire({
          title: '¿Estás seguro de cerrar el chat?',
          text: 'No podrás revertirlo!',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cerrar!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            await service.closeChat(isSuccess, idChat);
            Swal.fire({
              title: 'Cerrar!',
              text: 'El chat ha sido cerrado.',
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#6C6DE7',
            });
            toast.add({ severity: 'success', summary: 'Éxito', detail: '¡Haz cerrado el chat, intercambio concretado!', life: 2000 });
            getAllByIdUsuario(accountStore?.user?.idUsuario ?? "")
          }
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo cerrar el chat.',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6C6DE7',
        });
      }
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método closeChat del store chat: ${error.message}`,
        excepcion: error.toString(),
      })
    }
  }

  return { list, getAll, getAllByIdUsuario, getById, deleteItem, create, update, closeChat }
})
