import type { IBaseObject } from '../Base'

export interface IMensaje extends IBaseObject {
  idUsuarioEmisor: string
  idUsuarioReceptor: string
  contenido: string
  fechaEnvio: Date
}
