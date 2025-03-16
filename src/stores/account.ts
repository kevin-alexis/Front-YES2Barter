import type { IUser } from '@/interfaces/account/IAccount'
import { AccountService } from '@/services/account/AccountService'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import { computed, ref } from 'vue'
import { jwtDecode } from 'jwt-decode'
import router from '@/router'
import { LogService } from '@/services/log/LogService'

export const useAccountStore = defineStore('account', () => {
  const user = ref(null)
  const token = ref('')
  const service = new AccountService()
  const logService = new LogService()
  const list = ref([])
  const listRoles = ref([])
  const isLoggedIn = computed(() => {
    return !!user.value
  });

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
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método isTokenExpired del store account: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error('Invalid token:', error)
      return true
    }
  }

  async function getAll() {
    try {
      const response = await service.getAll()
      list.value = await response.data
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAll del store account: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function login(userData: IUser, rememberMe: boolean) {
    try {
      const response = await service.login(userData, rememberMe);
      if (response.success) {
        await getUser();
        router.replace({ name: 'inicio' });
      } else {
        Swal.fire({
          title: 'Error',
          text: response.message,
          icon: 'error',
        });
      }
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método login del store account: ${error?.message || error}`,
        excepcion: error?.toString() || 'Error desconocido',
      });
    }
  }


  async function refreshToken() {
    try {
      const response = await service.refreshToken();
      if (response.success) {

        getUser();
        return response.token;
      } else {
        logOut();
        return false;
      }
    } catch (error) {
      console.error('Error al refrescar token:', error);
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método refreshToken del store account: ${error.message}`,
        excepcion: error.toString(),
      });
      logOut();
      return false;
    }
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
              user.value.rol ===
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
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método signIn del store account: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function logOut() {
    try {
      if(isLoggedIn){
        await service.logout();
        router.replace({ name: "login" })
        user.value = null;
      }
    } catch (error) {
      logService.create({
        nivel: "Error",
        mensaje: `Error en el método logOut del store account: ${error.message}`,
        excepcion: error.toString(),
      });
    }
  }


  async function getUser() {
    try {
      const response = await service.getCurrentUser();
      if (response && response.idPersona) {
        user.value = response;
      } else {
        user.value = null;
        logOut();
      }
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getUser del store account: ${error.message}`,
        excepcion: error.toString(),
      });
      logOut();
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
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método deleteItem del store account: ${error.message}`,
        excepcion: error.toString(),
      })
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
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método update del store account: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  async function getAllRoles() {
    try {
      const response = await service.getAllRoles()
      listRoles.value = await response
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getAllRoles del store account: ${error.message}`,
        excepcion: error.toString(),
      })
      console.error(error)
    }
  }

  // Todo: Hasta aquí

  return {
    user,
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
    refreshToken,
  }
})
