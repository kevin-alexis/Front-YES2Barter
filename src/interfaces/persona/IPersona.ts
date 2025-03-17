import type { IBaseObject } from '../Base'

export interface IPersona extends IBaseObject {
  nombre: string
  biografia: string
  idUsuario: string
  rutaFotoPerfil: string
}
