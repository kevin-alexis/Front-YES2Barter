import type { IPropuestaIntercambio } from '@/interfaces/propuestaIntercambio/IPropuestaIntercambio'
import { genericRequestAuthenticated, genericRequestFormDataAuthenticated } from '@/utils/genericRequest'
import { BaseService } from '../BaseService'

export class PropuestaIntercambioService extends BaseService<IPropuestaIntercambio> {
  private static nameController = 'PropuestaIntercambio'

  constructor() {
    super(PropuestaIntercambioService.nameController)
  }

  public getAllPropuestas = async () => {
    try {
      const response = await genericRequestAuthenticated(
        `/PropuestaIntercambio/GetAllPropuestas/`,
        'GET',
      )
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método GetAllPropuestas: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public GetAllByIdObjeto = async (id: string) => {
    try {
      const response = await genericRequestAuthenticated(
        `/PropuestaIntercambio/GetAllByIdObjeto/${id}`,
        'GET',
      )
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método GetAllByIdObjeto: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public createPropuestaIntercambio = async (body: any) => {
    try {
      const response = await genericRequestAuthenticated(
        `/PropuestaIntercambio/CreatePropuestaIntercambio/`,
        'POST',
        body
      )
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método createPropuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }


  public updatePropuestaIntercambio = async (id: number, body: any) => {
    try {
      const response = await genericRequestAuthenticated(
        `/PropuestaIntercambio/UpdatePropuestaIntercambio/${id}`,
        'PUT',
        body
      )
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método updatePropuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public deletePropuestaIntercambio = async (id: number) => {
    try {
      const response = await genericRequestAuthenticated(
        `/PropuestaIntercambio/DeletePropuestaIntercambio/${id}`,
        'DELETE'
      )
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método deletePropuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public getAllByIdUsuarioAndIdObjeto = async (idUsuario: string, idObjeto: number) => {
    try {
      const response = await genericRequestAuthenticated(
        `/PropuestaIntercambio/GetAllByIdUsuarioAndIdObjeto/?idUsuario=${idUsuario}&idObjeto=${idObjeto}`,
        'GET'
      )
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllByIdUsuarioAndIdObjeto: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public acceptOrDeclinePropuestaIntercambio = async (idPropuesta: number, isAccepted: boolean) => {
    try {
      const body = { idPropuesta, isAccepted }
      const response = await genericRequestAuthenticated(
        `/PropuestaIntercambio/AcceptOrDeclinePropuestaIntercambio/`,
        'POST',
        body
      )
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método acceptOrDeclinePropuestaIntercambio: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

}
