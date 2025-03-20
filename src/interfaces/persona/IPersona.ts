import type { IBaseObject } from '../Base'

export interface IPersona extends IBaseObject {
  nombre: string
  biografia: string
  idUsuario: string
  rutaFotoPerfil: string
}

export interface IUpdatePersona extends IBaseObject {
  nombre: string
  biografia?: string
  rutaFotoPerfil?: string
}

