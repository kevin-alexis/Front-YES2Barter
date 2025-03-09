import type { IBaseObject } from '../Base'
import type { IPersona } from '../persona/IPersona'

export interface IMensaje extends IBaseObject {
  idUsuarioEmisor: string
  idUsuarioReceptor: string
  contenido: string
  fechaEnvio: Date
}

export interface IMensajeVM extends IMensaje {
  personaEmisor: IPersona
  personaReceptor: IPersona
}
