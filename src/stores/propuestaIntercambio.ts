import { PropuestaIntercambioService } from '../services/propuesta-intercambio/PropuestaIntercambioService.ts'
import type { IPropuestaIntercambio } from '../interfaces/propuestaIntercambio/IPropuestaIntercambio.ts'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import Swal from 'sweetalert2'
import router from '@/router'
import { useRoute } from 'vue-router'
import { LogService } from '@/services/log/LogService'
import { useToast } from 'primevue/usetoast';

export const usePropuestaIntercambioStore = defineStore('propuesta intercambio', () => {
  const service = new PropuestaIntercambioService()
  const logService = new LogService()
  const list: Ref<IPropuestaIntercambio[]> = ref([])
  const toast = useToast()

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
        if(response.success){
            Swal.fire({
              title: '¡Éxito!',
              text: response.message,
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#6C6DE7',
            }).then(() => {
              toast.add({severity:'success', summary: 'Éxito', detail: '¡Haz realizado correctamente la propuesta!', life: 2000});
              router.back()
          })
        }else{
          Swal.fire({
            title: 'Error!',
            text: response.message,
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#6C6DE7',
          })
        }

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

  async function update(id: number, item: any) {
    try {
      const response = await service.updatePropuestaIntercambio(id, item).then((response) => {
        if(response.success){
          Swal.fire({
            title: '¡Éxito!',
            text: response.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#6C6DE7',
          }).then(() => {
            router.back()
          })
        }else{
          Swal.fire({
            title: 'Error',
            text: response.message,
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#6C6DE7',
          })
        }

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
            .deletePropuestaIntercambio(id)
            .then(async () => {
              Swal.fire({
                title: 'Eliminar!',
                text: 'El registro fue eliminado.',
                icon: 'success',
              })
              await getAllPropuestas()
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

  async function getAllByIdUsuarioAndIdObjeto(idUsuario: string, idObjeto: number) {
    try {
      const response = await service.getAllByIdUsuarioAndIdObjeto(idUsuario, idObjeto)
      return await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllByIdUsuarioAndIdObjeto del store propuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function acceptOrDeclinePropuestaIntercambio(idPropuesta: number, isAccepted: boolean) {
    try {
        if (isAccepted === false) {
          Swal.fire({
            title: '¿Estas seguro de rechazar la propuesta?',
            text: '¡No podrás revertirlo!',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, rechazar',
            confirmButtonColor: '#3085d6',
          }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await service.acceptOrDeclinePropuestaIntercambio(idPropuesta, isAccepted);
                Swal.fire({
                  title: '¡Rechazado!',
                  text: '¡Se ha rechazado correctamente la propuesta!',
                  icon: 'success',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#6C6DE7',
          })
          .then(() => {
            toast.add({severity:'info', summary: 'Éxito', detail: '¡Se ha rechazado correctamente la propuesta!', life: 2000});
            router.back()
          })
        }
      });
        }else if(isAccepted === true){
          const response = await service.acceptOrDeclinePropuestaIntercambio(idPropuesta, isAccepted);
            Swal.fire({
              title: '¡Éxito!',
              text: '¡Haz aceptado la propuesta!',
              icon: 'success',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#6C6DE7',
            }).then(() => {
              toast.add({severity:'success', summary: 'Éxito', detail: '¡Se ha aceptado correctamente la propuesta!', life: 2000});
              router.back()
          })
        }else{
          Swal.fire({
            title: 'Error!',
            text: response.message,
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#6C6DE7',
          })
        }
      // return await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método acceptOrDeclinePropuestaIntercambio del store propuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  return { list, getAll, getAllByIdUsuarioAndIdObjeto, getAllPropuestas, getById, getAllByIdObjeto, deleteItem, create, update, acceptOrDeclinePropuestaIntercambio }
})
