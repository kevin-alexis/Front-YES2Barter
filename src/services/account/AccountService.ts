import type { IAccount, IUser } from '@/interfaces/account/IAccount'
import { BaseService } from '../BaseService'
import { genericRequest, genericRequestAuthenticated } from '@/utils/genericRequest'
import { useAccountStore } from '@/stores/account'
import { LogService } from '../log/LogService'

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
        const response = await genericRequestAuthenticated('/Account/refreshToken', 'POST');

        if (response?.token) {
            const accountStore = useAccountStore();
            accountStore.token = response.token;
            console.log('Token renovado:', response.token);
            return response.token;
        } else {
            console.warn('No se pudo renovar el token.');
            return null;
        }
    } catch (error) {
        const logService = new LogService();
        logService.create({
            nivel: 'Error',
            mensaje: `Error en el método refreshToken del store account: ${error.message}`,
            excepcion: error.toString(),
        });
        console.error('Error al renovar el token:', error);
        return null;
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
}
