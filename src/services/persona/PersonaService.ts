import { BaseService } from '../BaseService'
import { genericRequestAuthenticated } from '@/utils/genericRequest'
import type { IPersona } from '@/interfaces/persona/IPersona'

export class PersonaService extends BaseService<IPersona> {
  private static nameController = 'Persona'

  constructor() {
    super(PersonaService.nameController)
  }

  public getAllPersonasIntercambiadores = async () => {
    try {
      const response = await genericRequestAuthenticated('/Persona/GetAllPersonasIntercambiadores', 'GET')
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllPersonasIntercambiadores: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

}
