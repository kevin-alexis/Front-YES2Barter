import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LogService } from '@/services/log/LogService'
import { PersonaService } from '@/services/persona/PersonaService'

export const usePersonaStore = defineStore('persona', () => {
  const persona = ref(null)
  const service = new PersonaService()
  const logService = new LogService()
  const list = ref([])

  async function getAllPersonasIntercambiadores() {
    try {
      const response = await service.getAllPersonasIntercambiadores()
      list.value = await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllPersonasIntercambiadores del store persona: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function getPersonaByIdUsuario(idUsuario: string) {
    try {
      const response = await service.getPersonaByIdUsuario(idUsuario)
      persona.value = await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getPersonaByIdUsuario del store persona: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }


  return {
    getAllPersonasIntercambiadores,
    getPersonaByIdUsuario,
    list,
    persona
  }
})
