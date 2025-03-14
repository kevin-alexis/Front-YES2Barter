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
      const response = await genericRequest('/Account/login', 'POST', userData, {
        withCredentials: true,
      })
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

  public async refreshToken() {
    try {
      console.log('Solicitando refreshToken...');

      await genericRequestAuthenticated('/Account/refreshToken', 'POST', {});
      // console.log('Token renovado correctamente.');
      return true;
    } catch (error) {
      console.error(`Error en refreshToken: ${error.message}`);
      return false;
    }
  }


  public getAll = async () => {
    try {
      const response = await genericRequestAuthenticated('/Account/GetAllAccounts', 'GET', {
        withCredentials: true,
      })
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

  public async getCurrentUser() {
    try {
      const response = await genericRequestAuthenticated('/Account/currentUser', 'GET');

      if (response?.success && response.data) {
        return response.data;
      }
      return null;

    } catch (error: any) {
      console.error('Error obteniendo usuario:', error?.message ?? error);
      return null;
    }
  }


  public async logout() {
    try {
      return await genericRequest('/Account/logout', 'POST');
    } catch (error) {
      console.error('Error en logout:', error.message);
      throw error;
    }
  }

}
