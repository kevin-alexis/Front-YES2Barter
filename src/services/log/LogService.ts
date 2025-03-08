import type { ILog } from '@/interfaces/log/ILog'
import { BaseService } from '../BaseService'

export class LogService extends BaseService<ILog> {
  private static nameController = 'Log'

  constructor() {
    super(LogService.nameController)
  }
}
