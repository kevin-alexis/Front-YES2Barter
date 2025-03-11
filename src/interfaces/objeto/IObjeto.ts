import type { IBaseObject } from '../Base'

export interface IObjeto extends IBaseObject {
  nombre: string
  descripcion: string
  precio: number
  idCategoria: number
  fechaPublicacion: Date
  rutaImagen: string
}
