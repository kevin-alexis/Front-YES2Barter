import type { IMensaje } from './../../interfaces/mensaje/IMensaje'
import { BaseService } from '../BaseService'
import { genericRequestAuthenticated } from '@/utils/genericRequest'

export class MensajeService extends BaseService<IMensaje> {
  private static nameController = 'Mensaje'

  constructor() {
    super(MensajeService.nameController)
  }

  public getAllByIdChat = async (idChat: number) => {
      try {
        const response = await genericRequestAuthenticated(`/${MensajeService.nameController}/GetAllByIdChat/${idChat}`, 'GET')
        return response
      } catch (error) {
        console.error(error)
      }
    }
}
