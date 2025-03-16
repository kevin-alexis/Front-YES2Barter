import type { IBaseObject } from '../Base'
import type { IPersona } from '../persona/IPersona'
import type { IPropuestaIntercambioWithData } from '../propuestaIntercambio/IPropuestaIntercambio'

export interface IChat extends IBaseObject {
  idUsuario1: string
  idUsuario2: string
  idPropuestaIntercambio: number
}

export interface IGetChatsVM extends IChat {
  personaEmisor: IPersona
  personaReceptor: IPersona
  propuestaIntercambio: IPropuestaIntercambioWithData
}
