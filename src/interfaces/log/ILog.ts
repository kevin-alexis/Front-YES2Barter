import type { IBaseObject } from '../Base'

export interface ILog extends IBaseObject {
  fecha?: Date
  nivel?: string
  fuente?: string
  mensaje: string
  excepcion: string
}
