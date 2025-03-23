import type { IObjeto } from '../interfaces/objeto/IObjeto'
import { ObjetoService } from '../services/objeto/ObjetoService'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import Swal from 'sweetalert2'
import router from '@/router'
import { LogService } from '@/services/log/LogService'
import { EstatusObjeto } from '../common/enums/enums';
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { AccountService } from '../services/account/AccountService';

export const useObjetoStore = defineStore('objeto', () => {
  const service = new ObjetoService()
  const logService = new LogService()
  const list: Ref<IObjeto[]> = ref([])
  const toast = useToast()
  const accountService = new AccountService()

  async function getAllByIdEstatus(estatus?: EstatusObjeto) {
    try {
      const currentUser = await accountService.getCurrentUser()
      if (!currentUser) {
        console.warn('No se encontró un usuario autenticado.')
        return
      }
      const response = await service.getAllByIdEstatus(estatus)
      list.value = response.filter(obj => obj.idUsuario !== currentUser.idUsuario)
      console.log(list.value)
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllByIdEstatus del store objeto: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function getAll() {
    try {
      const response = await service.getAll()
      list.value = await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAll del store objeto: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function getByName(name: string) {
    try {
      const response = await service.GetByName(name)
      if (response.success) {
        list.value = response.data
      } else{
        list.value=[]
        Swal.fire({
          title: 'No se encontraron objetos',
          text: response.message || 'No se encontraron objetos con ese nombre.',
          icon: 'warning',
        })
      }
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getByName del store objeto: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function getAllByIdUsuario(id: string) {
    try {
      const response = await service.GetAllByIdUsuario(id)
      list.value = await response.data
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllByIdUsuario del store objeto: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function getAllByIdCategoria(id: string) {
    try {
      const response = await service.GetAllByIdCategoria(id)
      list.value = await response.data
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllByIdCategoria del store objeto: ${error.message}`,
        excepcion: error.toString(),
      })
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
          toast.add({ severity: 'success', summary: 'Éxito', detail: 'El objeto ha sido añadido exitosamente a la lista.', life: 2000 })
          router.back()
        })
      })
      return await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método create del store objeto: ${error.message}`,
        excepcion: error.toString(),
      })
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
          toast.add({ severity: 'success', summary: 'Éxito', detail: 'El objeto ha sido editado exitosamente.', life: 2000 })
          router.back()
        })
      })
      return await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método update del store objeto: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function deleteItem(id: number) {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertirlo!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
      });

      if (result.isConfirmed) {
        try {
          const response = await service.delete(id);
          if (response?.success) {
            await Swal.fire({
              title: 'Eliminado!',
              text: response.message || 'El objeto fue eliminado.',
              icon: 'success',
            });

            await getAll();
          } else {
            throw new Error(response?.message || 'El objeto tiene propuestas activas y no puede ser eliminado.');
          }
        } catch (error) {
          await Swal.fire({
            title: 'No se pudo eliminar!',
            text: error.message || 'Ocurrió un error inesperado.',
            icon: 'error',
          });
        }
      }
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método deleteItem del store objeto: ${error.message}`,
        excepcion: error.toString(),
      });

      console.error(error);

      await Swal.fire({
        title: 'Error!',
        text: 'Ocurrió un error inesperado.',
        icon: 'error',
      });
    }
  }

  async function getById(id: string) {
    try {
      const response = await service.getById(id)
      return await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getById del store objeto: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  return { list, getAll, getAllByIdEstatus, getById, getByName, getAllByIdUsuario, getAllByIdCategoria, deleteItem, create, update }
})
