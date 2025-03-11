import type { IObjeto } from '@/interfaces/objeto/IObjeto'

export interface IUsuario {
  id: string | number
  nombre: string
  biografia?: string
  otrosObjetos?: IObjeto[]
  // Add any other user properties you need
}
