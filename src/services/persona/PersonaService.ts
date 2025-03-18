import { genericRequestAuthenticated, genericRequestFormDataAuthenticated } from '@/utils/genericRequest'
import type { IPersona, IUpdatePersona } from '@/interfaces/persona/IPersona'
import { BaseService } from '../BaseService'

export class PersonaService extends BaseService<IPersona> {
  private static nameController = 'Persona'

  constructor() {
    super(PersonaService.nameController)
  }

  public getAllPersonasIntercambiadores = async () => {
    try {
      const response = await genericRequestAuthenticated('/Persona/GetAllPersonasIntercambiadores', 'GET')
      return response
    } catch (error: unknown) {
      if (error instanceof Error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllPersonasIntercambiadores: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)

    }
  }
}

  public getPersonaByIdUsuario = async (idUsuario: string) => {
    try {
      const response = await genericRequestAuthenticated(`/Persona/GetPersonaByIdUsuario/${idUsuario}`, 'GET')
      return response
    } catch (error: unknown) {
      if (error instanceof Error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getPersonaByIdUsuario: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }
}
  public createPersona = async (formData: FormData) => {
    try {
      const response = await genericRequestAuthenticated('/Persona/CreatePersona', 'POST', formData)
      return response
    } catch (error: unknown) {
      if (error instanceof Error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método createPersona: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }
}
  public updatePersona = async (id: string, formData: IUpdatePersona) => {
    try {
      const response = await genericRequestFormDataAuthenticated(`/Persona/UpdatePerfil/${id}`, 'PUT', formData)
      return response
    } catch (error: unknown) {
      if (error instanceof Error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método updatePersona: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }
  }
}
