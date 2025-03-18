import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LogService } from '@/services/log/LogService'
import { PersonaService } from '@/services/persona/PersonaService'
import type { IUpdatePersona } from '@/interfaces/persona/IPersona'
import { useToast } from 'primevue/usetoast'
import router from '@/router'

export const usePersonaStore = defineStore('persona', () => {
  const persona = ref(null)
  const service = new PersonaService()
  const logService = new LogService()
  const list = ref([])
  const toast = useToast()

  async function getAllPersonasIntercambiadores() {
    try {
      const response = await service.getAllPersonasIntercambiadores()
      list.value = await response
    } catch (error: unknown) {
      if (error instanceof Error) {
        logService.create({
          nivel: 'Error',
          mensaje: `Error en el método getAllPersonasIntercambiadores del store persona: ${error.message}`,
          excepcion: error.toString(),
        })
        console.error(error)
      }
    }
  }
  async function getPersonaByIdUsuario(idUsuario: string) {
    try {
      const response = await service.getPersonaByIdUsuario(idUsuario)
      persona.value = await response
      return response
    } catch (error: unknown) {
      if (error instanceof Error) {
        logService.create({
          nivel: 'Error',
          mensaje: `Error en el método getPersonaByIdUsuario del store persona: ${error.message}`,
          excepcion: error.toString(),
        })
        console.error(error)
      }
    }
  }

  async function updatePersona(id: string, formData: IUpdatePersona) {
    try {
      const response = await service.updatePersona(id, formData)
      if (response.success) {
        toast.add({
          severity: 'success',
          summary: 'Perfil editado',
          detail: response.message,
          life: 2000,
        })
        router.replace({ name: 'perfil' })
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 2000 })
      }
      persona.value = response.data
    } catch (error: unknown) {
      if (error instanceof Error) {
        logService.create({
          nivel: 'Error',
          mensaje: `Error en el método updatePersona del store persona: ${error.message}`,
          excepcion: error.toString(),
        })
        console.error(error)
      }
    }
  }

  async function updateFotoPersona(id: number, rutaFotoPerfil: FormData) {
    try {
      const response = await service.updateFotoPersona(id, rutaFotoPerfil)
      if (response.success) {
        toast.add({
          severity: 'success',
          summary: 'Perfil editado',
          detail: response.message,
          life: 2000,
        })
        persona.value = response.data
        router.replace({ name: 'perfil' })
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: response.message, life: 2000 })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        logService.create({
          nivel: 'Error',
          mensaje: `Error en el método updateFotoPersona del store persona: ${error.message}`,
          excepcion: error.toString(),
        })
        console.error(error)
      }
    }
  }

  return {
    getAllPersonasIntercambiadores,
    getPersonaByIdUsuario,
    list,
    persona,
    updatePersona,
    updateFotoPersona
  }
})
