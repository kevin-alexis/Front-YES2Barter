import { BaseService } from '../BaseService'
import type { IPropuestaIntercambio } from '@/interfaces/propuestaIntercambio/IPropuestaIntercambio'
import { genericRequestAuthenticated, genericRequestFormData } from '@/utils/genericRequest'

export class PropuestaIntercambioService extends BaseService<IPropuestaIntercambio> {
  private static nameController = 'PropuestaIntercambio'

  constructor() {
    super(PropuestaIntercambioService.nameController)
  }

  public GetAllByIdObjeto = async (id: string) => {
    try {
      const response = await genericRequestAuthenticated(`/PropuestaIntercambio/GetAllByIdObjeto/${id}`, 'GET')
      return response
    } catch (error) {
      console.error(error)
    }
  }

  public updatePropuestaIntercambio = async (id: string, body: any) => {
    try {
      const formData = new FormData()

      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          formData.append(key, body[key])
        }
      }

      const response = await genericRequestFormData(
        `/PropuestaIntercambio/update-propuesta-intercambio/${id}`,
        'PUT',
        formData,
      )
      return response
    } catch (error) {
      console.error('Error al actualizar el capítulo:', error)
    }
  }

  public createPropuestaIntercambio = async (body: any) => {
    try {
      const formData = new FormData()

      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          formData.append(key, body[key])
        }
      }

      const response = await genericRequestFormData(`/PropuestaIntercambio/create-propuesta-intercambio/`, 'POST', formData)
      return response
    } catch (error) {
      console.error('Error al crear el capítulo:', error)
    }
  }
}
