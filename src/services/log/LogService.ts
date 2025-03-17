import { genericRequestAuthenticated } from '@/utils/genericRequest'
export class LogService {
  private static nameController = 'Log'
  private baseUrl = import.meta.env.VITE_APP_URL_API

  constructor() {}

  public getAll = async () => {
    try {
      const response = await genericRequestAuthenticated(
        `${this.baseUrl}/${LogService.nameController}/`,
        'GET',
      )
      return response
    } catch (error) {
      console.error(error)
    }
  }

  public getById = async (id: string) => {
    try {
      const response = await genericRequestAuthenticated(
        `${this.baseUrl}/${LogService.nameController}/${id}`,
        'GET',
      )
      return response
    } catch (error) {
      console.error(error)
    }
  }

  public create = async <ILog>(body: ILog) => {
    try {
      const response = await genericRequestAuthenticated(
        `${this.baseUrl}/${LogService.nameController}`,
        'POST',
        {...body,
          fuente: `Front-End: ${window.location.origin}`,
        }
        ,
      )
      return response
    } catch (error) {
      console.error(error)
    }
  }
}
