import type { ICategoria } from '@/interfaces/categoria/ICategoria'
import { BaseService } from '../BaseService'

export class CategoriaService extends BaseService<ICategoria> {
  private static nameController = 'Categoria'

  constructor() {
    super(CategoriaService.nameController)
  }
}
