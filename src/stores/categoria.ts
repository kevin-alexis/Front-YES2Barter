import type { ICategoria } from '@/interfaces/categoria/ICategoria'
import { CategoriaService } from '../services/categoria/CategoriaService'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import Swal from 'sweetalert2'
import router from '@/router'
import { LogService } from '@/services/log/LogService'



export const useCategoriaStore = defineStore('categoria', () => {
  const service = new CategoriaService()
  const logService = new LogService()
  const list: Ref<ICategoria[]> = ref([])

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
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getById del store categoria: ${error.message}`,
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
          text: 'La categoria ha sido añadida exitosamente a la lista.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6C6DE7',
        }).then(() => {
          router.replace({ name: 'administrar categorias' })
        })
      })
      return await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método create del store categoria: ${error.message}`,
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
          text: 'La categoria ha sido editado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6C6DE7',
        }).then(() => {
          router.replace({ name: 'administrar categorias' })
        })
      })
      return await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método update del store categoria: ${error.message}`,
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
              text: response.message || 'La categoría fue eliminada.',
              icon: 'success',
            });

            await getAll();
          } else {
            throw new Error(response?.message || 'La categoría tiene objetos relacionados y no puede ser eliminada.');
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
        mensaje: `Error en deleteItem: ${error.message}`,
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





  return { list, getAll, getById, deleteItem, create, update }
})
