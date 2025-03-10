import type { IAccount, IUser } from '@/interfaces/account/IAccount'
import { BaseService } from '../BaseService'
import { genericRequest, genericRequestAuthenticated } from '@/utils/genericRequest'

export class AccountService extends BaseService<IAccount> {
  private static nameController = 'Account'

  constructor() {
    super(AccountService.nameController)
  }

  public login = async (user: IUser) => {
    try {
      const response = await genericRequest('/Account/login', 'POST', user)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  public getAll = async () => {
    try {
      const response = await genericRequestAuthenticated('/Account/GetAllAccounts', 'GET')
      return response
    } catch (error) {
      console.error(error)
    }
  }

  public getAllRoles = async () => {
    try {
      const response = await genericRequestAuthenticated('/Account/getAllRoles', 'GET')
      return response
    } catch (error) {
      console.error(error)
    }
  }
}
