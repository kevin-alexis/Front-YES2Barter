import type { IUser } from '@/interfaces/account/IAccount'
import { AccountService } from '@/services/account/AccountService'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import Swal from 'sweetalert2'
import { computed, ref } from 'vue'
import { jwtDecode } from 'jwt-decode'
import router from '@/router'

export const useAccountStore = defineStore('account', () => {
  const user = ref(null)
  const token = useStorage('token', '')
  const service = new AccountService()
  const list = ref([])
  const listRoles = ref([])
  const isLoggedIn = computed(() => {
    if (token.value && !user.value) {
      getUser()
    }
    return token.value !== '' && token.value !== undefined
  })
  function isTokenExpired(): boolean {
    if (!token.value) {
      return true
    }
    try {
      const decodedToken: any = jwtDecode(token.value)
      const exp = decodedToken?.exp
      if (!exp) {
        return true
      }
      return Date.now() >= exp * 1000
    } catch (error) {
      console.error('Invalid token:', error)
      return true
    }
  }
  async function getAll() {
    try {
      const response = await service.getAll()
      list.value = await response.data
    } catch (error) {
      console.error(error)
    }
  }

  async function login(userData: IUser, rememberMe: boolean) {
    await service.login(userData, rememberMe).then((response) => {
      if (response.success) {
        token.value = response.token
        getUser()
        router.replace({ name: 'inicio' })
      } else {
        Swal.fire({
          title: 'Error',
          text: response.message,
          icon: 'error',
        })
      }
    })
  }

  function signIn(userData: IUser) {
    try {
      service.create(userData).then((response) => {
        if (response.success) {
          Swal.fire({
            title: '¡Registro Completo!',
            text: 'Tu registro ha sido realizado con éxito.',
            icon: 'success',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#6C6DE7',
          }).then(() => {
            if (
              token &&
              user.value['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ===
                'Administrador'
            ) {
              router.replace({ name: 'administrar usuarios' })
            } else {
              router.replace({ name: 'login' })
            }
          })
        } else {
          Swal.fire({
            title: 'Error',
            text: response.message,
            icon: 'error',
          })
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  function logOut() {
    token.value = ''
    router.replace({ name: 'login' })
  }

  function getUser() {
    if (token.value) {
      try {
        if (isTokenExpired()) {
          logOut()
          return
        }
        user.value = jwtDecode(token.value)
        console.error(user.value)
      } catch (error) {
        console.error('Invalid token:', error)
        token.value = ''
        logOut()
        // return false
      }
    }
  }

  // Todo: esto es para el crud de usaurios

  async function deleteItem(id: number) {
    try {
      Swal.fire({
        title: '¿Estas seguro?',
        text: 'No podras revertirlo!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await service
            .delete(id)
            .then(async () => {
              Swal.fire({
                title: 'Eliminar!',
                text: 'El registro fue eliminado.',
                icon: 'success',
              })
              await getAll()
            })
            .catch((error) => {
              Swal.fire({
                title: 'No se pudo elimnar!',
                text: `El registro no fue eliminado ${error}.`,
                icon: 'error',
              })
            })
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function getById(id: string) {
    try {
      const response = await service.getById(id)
      return await response
    } catch (error) {
      console.error(error)
    }
  }

  async function update(id: string, item: any) {
    try {
      const response = await service.update(id, item).then(() => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'La cuenta ha sido editado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6C6DE7',
        }).then(() => {
          router.back()
        })
      })
      return await response
    } catch (error) {
      console.error(error)
    }
  }

  async function getAllRoles() {
    try {
      const response = await service.getAllRoles()
      listRoles.value = await response
    } catch (error) {
      console.error(error)
    }
  }

  // Todo: Hasta aquí

  return {
    user,
    token,
    login,
    signIn,
    getUser,
    logOut,
    isLoggedIn,
    getAll,
    getById,
    list,
    deleteItem,
    getAllRoles,
    listRoles,
    update,
  }
})
