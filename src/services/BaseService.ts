import axios from 'axios'

export class BaseService<T> {
  private baseUrl = import.meta.env.VITE_APP_URL_API
  private nameController: string
  private token: string | null

  constructor(nameController: string) {
    this.nameController = nameController
    this.token = localStorage.getItem('token') || ''
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
      console.error(error)
    }
  }
}
