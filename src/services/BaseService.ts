import axios from 'axios'
import { LogService } from './log/LogService'

export class BaseService<T> {
  private baseUrl = import.meta.env.VITE_APP_URL_API
  private nameController: string
  private token: string | null
  protected logService: LogService

  constructor(nameController: string) {
    this.nameController = nameController
    this.token = localStorage.getItem('token') || ''
    this.logService = new LogService()
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    }
  }

  public getAll = async () => {
    try {
      const response = await axios.get(`${this.baseUrl}/${this.nameController}/`, {
        headers: this.getHeaders(),
      })
      return response.data
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAll: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public getById = async (id: string) => {
    try {
      const response = await axios.get(`${this.baseUrl}/${this.nameController}/${id}`, {
        headers: this.getHeaders(),
      })
      return response.data
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getById: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public create = async (body: T) => {
    try {
      const response = await axios.post(`${this.baseUrl}/${this.nameController}`, body, {
        headers: this.getHeaders(),
      })
      return response.data
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método create: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public update = async (id: string, body: T) => {
    try {
      const response = await axios.put(`${this.baseUrl}/${this.nameController}/${id}`, body, {
        headers: this.getHeaders(),
      })
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método update: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  public delete = async (id: string) => {
    try {
      const response = await axios.delete(`${this.baseUrl}/${this.nameController}/${id}`, {
        headers: this.getHeaders(),
      })
      return response
    } catch (error) {
      this.logService.create({
        nivel: 'Error',
        mensaje: `Error en el método delete: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }
}
