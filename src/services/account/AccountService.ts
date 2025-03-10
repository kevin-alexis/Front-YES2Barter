import type { IAccount, IUser } from '@/interfaces/account/IAccount'
import { BaseService } from '../BaseService'
import { genericRequest, genericRequestAuthenticated } from '@/utils/genericRequest'

export class AccountService extends BaseService<IAccount> {
  private static nameController = 'Account'

  constructor() {
    super(AccountService.nameController)
  }

  public login = async (user: IUser, rememberMe: boolean) => {
    try {
      const userData = { ...user, rememberMe }
      const response = await genericRequest('/Account/login', 'POST', userData)
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método login: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public getAll = async () => {
    try {
      const response = await genericRequestAuthenticated('/Account/GetAllAccounts', 'GET')
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAll: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public getAllRoles = async () => {
    try {
      const response = await genericRequestAuthenticated('/Account/getAllRoles', 'GET')
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllRoles: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }
}
