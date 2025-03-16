import type { IBaseObject } from '../Base'
import type { IObjeto } from '../objeto/IObjeto'
import type { IPersona } from '../persona/IPersona'

export interface IPropuestaIntercambio extends IBaseObject {
  idUsuarioOfertante: string
  idUsuarioReceptor: string
  idObjetoOfertado: number
  idObjetoSolicitado: number
  estado: number
  fechaPropuesta: Date
}

export interface IPropuestaIntercambioWithData extends IPropuestaIntercambio {
  usuarioOfertante: IPersona
  usuarioReceptor: IPersona
  objetoOfertado: IObjeto
  objetoSolicitado: IObjeto
}
