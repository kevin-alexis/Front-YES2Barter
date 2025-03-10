import { BaseService } from '../BaseService'
import { genericRequestAuthenticated } from '@/utils/genericRequest'
import type { IChat } from '@/interfaces/chat/IChat'
import router from '@/router'

export class ChatService extends BaseService<IChat> {
  private static nameController = 'Chat'

  constructor() {
    super(ChatService.nameController)
  }

  public getAllByIdUsuario = async (id: string) => {
    try {
      const response = await genericRequestAuthenticated(`/Chat/GetAllByIdUsuario/${id}`, 'GET')
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllByIdUsuario: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public closeChat = async (isSuccess: boolean, idChat: number) => {
    try {
      const response = await genericRequestAuthenticated(`/Chat/CloseChat/`, 'POST', {
        isSuccess,
        idChat,
      }).then(() => {
        router.replace({ name: 'chat' })
      })
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método closeChat: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }
}
