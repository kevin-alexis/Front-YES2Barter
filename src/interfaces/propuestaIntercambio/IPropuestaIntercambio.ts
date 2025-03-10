import type { IBaseObject } from '../Base'

export interface IPropuestaIntercambio extends IBaseObject {
  idUsuarioOfertante: string
  idUsuarioReceptor: string
  idObjetoOfertado: number
  idObjetoSolicitado: number
  fechaPropuesta: Date
}
