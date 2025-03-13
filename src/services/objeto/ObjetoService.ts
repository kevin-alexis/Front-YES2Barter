import type { IObjeto } from '@/interfaces/objeto/IObjeto'
import { BaseService } from '../BaseService'
import { genericRequestAuthenticated, genericRequestFormDataAuthenticated } from '@/utils/genericRequest'

export class ObjetoService extends BaseService<IObjeto> {
  private static nameController = 'Objeto'

  constructor() {
    super(ObjetoService.nameController)
  }

  public GetByName = async (name: string) => {
    try {
      const response = await genericRequestAuthenticated('/Objeto/GetByName', 'POST', name)
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método GetByName: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public GetAllByIdUsuario = async (id: string) => {
    try {
      const response = await genericRequestAuthenticated(`/Objeto/GetAllByIdUsuario/${id}`, 'GET')
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método GetAllByIdUsuario: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public GetAllByIdCategoria = async (id: string) => {
    try {
      const response = await genericRequestAuthenticated(`/Objeto/GetAllByIdCategoria/${id}`, 'GET')
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método GetAllByIdCategoria: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public updateObjeto = async (id: string, body: any) => {
    try {
      const formData = new FormData()

      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          formData.append(key, body[key])
        }
      }

      const response = await genericRequestFormDataAuthenticated(`/Objeto/update-objeto/${id}`, 'PUT', formData)
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método updateObjeto: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error('Error al actualizar el objeto:', error)
    }
  }

  public createObjeto = async (body: any) => {
    try {
      const formData = new FormData()

      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          formData.append(key, body[key])
        }
      }

      const response = await genericRequestFormDataAuthenticated(`/Objeto/create-objeto/`, 'POST', formData)
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método createObjeto: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error('Error al crear el objeto:', error)
    }
  }
}
