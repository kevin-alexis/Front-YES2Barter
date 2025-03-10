import type { IBaseObject } from '../Base'

export interface IUser {
  nombre?: string
  email: string
  password: string
}

export interface IAccount extends IBaseObject {
  idPersona: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  idUsuario: string
  email: string
  numeroDeTelefono: string
  direccion: string
  contacto: string
  idRol: string
  rol: string
}


