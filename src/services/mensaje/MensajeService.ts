import type { IMensaje } from './../../interfaces/mensaje/IMensaje'
import { BaseService } from '../BaseService'

export class MensajeService extends BaseService<IMensaje> {
  private static nameController = 'Categoria'

  constructor() {
    super(MensajeService.nameController)
  }
}
