import type { IAccount, IUser } from '@/interfaces/account/IAccount'
import { AccountService } from '@/services/account/AccountService'
import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import { computed, ref } from 'vue'
import { LogService } from '@/services/log/LogService'
import { useToast } from 'primevue/usetoast';
import { ObjetoService } from '@/services/objeto/ObjetoService'


export const useAccountStore = defineStore('account', () => {
  const user = ref<IAccount | null>(null);
  const service = new AccountService()
  const logService = new LogService()
  const list = ref([])
  const listRoles = ref([])
  const toast = useToast();
  const isLoggedIn = computed(() => {
    return !!user.value
  });
  const objetoService = new ObjetoService()

  async function getAll() {
    try {
      const response = await service.getAll()
      if (response?.data) {
        list.value = await response.data.filter(userItem => userItem.idPersona !== user.value?.idPersona);
      }
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
        toast.add({ severity: 'success', summary: 'Sesión iniciada', detail: '¡Sesión iniciado con éxito!', life: 2000 });
        import('@/router').then(({ default: router }) => {
          router.replace({ name: 'inicio' });
        })
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
        // logOut();
        return false;
      }
    } catch (error) {
      console.error('Error al refrescar token:', error);
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método refreshToken del store account: ${error.message}`,
        excepcion: error.toString(),
      });
      // logOut();
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
            if (isLoggedIn.value && user.value && user.value.rol === 'Administrador') {
              import('@/router').then(({ default: router }) => {
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'El usuario ha sido añadido exitosamente a la lista.', life: 2000 })
                router.replace({ name: 'administrar usuarios' })
              })
            } else {
              import('@/router').then(({ default: router }) => {
                router.replace({ name: 'login' })
              })
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
      const result = await Swal.fire({
        title: '¿Estás seguro de cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        confirmButtonColor: '#3085d6',
      });

      if (result.isConfirmed) {
        if (isLoggedIn.value) {
          await service.logout();
        }
        user.value = null;
        import('@/router').then(({ default: router }) => {
          router.replace({ name: 'login' });
        })
      }
    } catch (error) {
      logService.create({
        nivel: 'Error',
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
        // logOut();
      }
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método getUser del store account: ${error.message}`,
        excepcion: error.toString(),
      });
      // logOut();
    }
  }

  // Todo: esto es para el crud de usaurios

  async function deleteItem(id: string) {

    try {
      const response = await objetoService.GetAllByIdUsuario(id);

      let lista = [];

      if (!response || !response.success) {
        console.warn("No se encontraron objetos asociados.");
      } else {
        lista = response.data || [];

        if (lista.length > 0) {
          Swal.fire({
            title: 'No se puede eliminar',
            text: 'Este usuario tiene objetos asociados.',
            icon: 'warning'
          });
          return;
        }
      }

      const result = await Swal.fire({
        title: '¿Estás seguro de eliminar este usuario?',
        text: 'No podrás revertirlo!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
      });

      if (!result.isConfirmed) return;

      await service.delete(id);

      Swal.fire({
        title: 'Eliminado!',
        text: 'El registro fue eliminado.',
        icon: 'success',
      });

      await getAll();
    } catch (error) {
      logService.create({
        nivel: 'Error',
        mensaje: `Error en el método deleteItem del store account: ${error.message}`,
        excepcion: error.toString(),
      });

      console.error(error);
      Swal.fire({
        title: 'No se pudo eliminar!',
        text: `El registro no fue eliminado ${error}.`,
        icon: 'error',
      });
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
          import('@/router').then(({ default: router }) => {
            toast.add({ severity: 'success', summary: 'Éxito', detail: 'La cuenta ha sido editado exitosamente.', life: 2000 })
            router.back()
          })
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
  async function resetPassword(values: { newPassword: string, confirmNewPassword: string }) {
    try {
      // Asegúrate de tener un endpoint que reciba las nuevas contraseñas
      const response = await service.resetPassword(values.newPassword, values.confirmNewPassword);
      if (response.success) {
        Swal.fire({
          title: 'Contraseña Restablecida',
          text: 'La contraseña ha sido cambiada con éxito.',
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6C6DE7',
        }).then(() => {
          // Lógica para redirigir al usuario a la página de login o donde sea necesario
          import('@/router').then(({ default: router }) => {
            router.replace({ name: 'login' });
          })
        });
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
        mensaje: `Error en el método resetPassword del store account: ${error.message}`,
        excepcion: error.toString(),
      });
      console.error('Error al restablecer la contraseña:', error);
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
    resetPassword
  }
})
