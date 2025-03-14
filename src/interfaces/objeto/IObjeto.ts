import type { IBaseObject } from '../Base'

export interface IObjeto extends IBaseObject {
  nombre: string
  descripcion: string
  idCategoria: number
  fechaPublicacion: Date
  rutaImagen: string
}

export interface IObjetoDetalles extends IObjeto {
  nombre: string
  descripcion: string
  idCategoria: number
  fechaPublicacion: Date
  rutaImagen: string
}
