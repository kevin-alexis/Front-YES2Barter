import type { IAccount, IUser } from '@/interfaces/account/IAccount'
import { genericRequest, genericRequestAuthenticated } from '@/utils/genericRequest'
import { BaseService } from '../BaseService'
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
      const response = await genericRequestAuthenticated('/Account/refreshToken', 'POST', {})
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método refreshToken: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(`Error en refreshToken: ${error.message}`)
      return false
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
      const response = await genericRequestAuthenticated('/Account/currentUser', 'GET')

      if (response?.success && response.data) {
        return response.data
      }
      return null
    } catch (error: any) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getCurrentUser: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error('Error obteniendo usuario:', error?.message ?? error)
      return null
    }
  }

  public async logout() {
    try {
      return await genericRequest('/Account/logout', 'POST')
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método logout: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error('Error en logout:', error.message)
      throw error
    }
  }
  public resetPassword = async (body: {
    email: string
    resetToken: string
    newPassword: string
  }) => {
    try {
      const response = await genericRequest(`/Account/reset-password`, 'POST', body)
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método resetPassword: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error('Error al restablecer la contraseña:', error)
      throw error
    }
  }
}
