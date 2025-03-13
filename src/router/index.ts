import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAccountStore } from '@/stores/account'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: HomeView,
      meta: { menu: true, title: 'Inicio', isPrivate: false, isShared: true, icon: 'pi-home' },
      // menu: para que aparezca en el header
      // tiitle: el nombre de la opcion en el header
      // isPrivate: es privada la ruta - cuando necesita iniciar sesión
      // isShared: la vista se va a compartir tanto privada como publica
      // icon: aparezca un icono
    },
    {
      path: '/nosotros',
      name: 'nosotros',
      component: () => import('../views/public/NosotrosView.vue'),
      meta: { menu: true, title: 'Nosotros', isPrivate: false, isShared: false, icon: 'pi-users' },
    },
    {
      path: '/servicios',
      name: 'servicios',
      component: () => import('../views/public/ServiciosView.vue'),
      meta: {
        menu: true,
        title: 'Servicios',
        isPrivate: false,
        isShared: false,
        icon: 'pi-wrench',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { menu: false, title: 'Login', isPrivate: false, isShared: false },
    },
    {
      path: '/sign-in',
      name: 'sign in',
      component: () => import('../views/auth/SignInView.vue'),
      meta: { menu: false, title: 'Sign In', isPrivate: false, isShared: false },
    },
    {
      path: '/buscador',
      name: 'buscador',
      component: () => import('../views/private/BuscadorView.vue'),
      meta: {
        menu: true,
        title: 'Buscador',
        isPrivate: true,
        isShared: false,
        icon: 'pi-search',
        roles: ['Intercambiador'],
      },
    },
    {
      path: '/categoria',
      name: 'administrar categorias',
      component: () => import('../views/private/Categorias/CategoriaView.vue'),
      meta: {
        menu: true,
        title: 'Administrar Categorias',
        isPrivate: true,
        isShared: false,
        icon: 'pi-objects-column',
        roles: ['Administrador'],
      },
    },
    {
      path: '/categoria/crear',
      name: 'crear categoria',
      component: () => import('../views/private/Categorias/CreateEditCategoriaView.vue'),
      meta: {
        menu: false,
        title: 'Crear Categoria',
        isPrivate: true,
        isShared: false,
        icon: 'pi-book',
        roles: ['Administrador', 'Intercambiador'],
      },
    },
    {
      path: '/categoria/editar/:id',
      name: 'editar categoria',
      component: () => import('../views/private/Categorias/CreateEditCategoriaView.vue'),
      meta: {
        menu: false,
        title: 'Editar Categoria',
        isPrivate: true,
        isShared: false,
        icon: 'pi-book',
        roles: ['Administrador', 'Intercambiador'],
      },
    },
    {
      path: '/objeto/',
      name: 'mis objetos',
      component: () => import('../views/private/Objeto/ObjetoView.vue'),
      meta: {
        menu: true,
        title: 'Mis Objetos',
        isPrivate: true,
        isShared: false,
        icon: 'pi-box',
        roles: ['Intercambiador', 'Administrador'],
      },
    },
    {
      path: '/objeto/:id',
      name: 'administrar objetos',
      component: () => import('../views/private/Objeto/ObjetoView.vue'),
      meta: {
        menu: false, // despues pasarlo a true y mandar el id del usuario logeado
        title: 'Administrar Objetos',
        isPrivate: true,
        isShared: false,
        icon: 'pi-book',
        roles: ['Administrador', 'Intercambiador'],
      },
    },
    {
      path: '/objeto/crear',
      name: 'crear objeto',
      component: () => import('../views/private/Objeto/CreateEditObjetoView.vue'),
      meta: {
        menu: false,
        title: 'Crear Objeto',
        isPrivate: true,
        isShared: false,
        icon: 'pi-book',
        roles: ['Administrador', 'Intercambiador'],
      },
    },
    {
      path: '/objeto/editar/:id',
      name: 'editar objeto',
      component: () => import('../views/private/Objeto/CreateEditObjetoView.vue'),
      meta: {
        menu: false,
        title: 'Editar Objeto',
        isPrivate: true,
        isShared: false,
        icon: 'pi-book',
        roles: ['Administrador', 'Intercambiador'],
      },
    },
    {
      path: '/objeto/detalles/:id',
      name: 'consultar detalles objeto',
      component: () => import('../views/private/Objeto/ObjetoDetalle.vue'),
      meta: {
        menu: false,
        title: 'Consultar Capítulos',
        isPrivate: true,
        isShared: false,
        icon: 'pi-book',
        roles: ['Administrador', 'Intercambiador'],
      },
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/private/Mensajes/MensajeView.vue'),
      meta: {
        menu: true,
        title: 'Chat',
        isPrivate: true,
        isShared: false,
        icon: 'pi-comments',
        roles: ['Intercambiador'],
      },
      children: [
        {
          path: ':id',
          name: 'chat detalles',
          component: () => import('../views/private/Mensajes/MensajeDetalle.vue'),
          meta: {
            menu: false,
            title: 'Chat',
            isPrivate: true,
            isShared: false,
            icon: 'pi-comments',
            roles: ['Intercambiador'],
          },
        },
      ],
    },
    {
      path: '/propuesta-intercambio/',
      name: 'administrar propuestas intercambios',
      component: () =>
        import('../views/private/PropuestasIntercambios/PropuestaIntercambioView.vue'),
      meta: {
        menu: true,
        title: 'Administrar Propuestas',
        isPrivate: true,
        isShared: false,
        icon: 'pi-book',
        roles: ['Administrador'],
      },
    },
    {
      path: '/propuesta-intercambio/crear/',
      name: 'crear propuesta intercambio',
      component: () =>
        import('../views/private/PropuestasIntercambios/CreateEditPropuestaIntercambioView.vue'),
      meta: {
        menu: false,
        title: 'Crear Capítulo',
        isPrivate: true,
        isShared: false,
        icon: 'pi-book',
        roles: ['Administrador', 'Intercambiador'],
      },
    },
    {
      path: '/propuesta-intercambio/editar/:id',
      name: 'editar propuesta intercambio',
      component: () =>
        import('../views/private/PropuestasIntercambios/CreateEditPropuestaIntercambioView.vue'),
      meta: {
        menu: false,
        title: 'Editar Capítulo',
        isPrivate: true,
        isShared: false,
        icon: 'pi-book',
        roles: ['Administrador', 'Intercambiador'],
      },
    },
    {
      path: '/usuarios',
      name: 'administrar usuarios',
      component: () => import('../views/private/Usuarios/UsuarioView.vue'),
      meta: {
        menu: true,
        title: 'Administrar Usuarios',
        isPrivate: true,
        isShared: false,
        icon: 'pi-users',
        roles: ['Administrador'],
      },
    },
    {
      path: '/usuarios/crear',
      name: 'crear usuario',
      component: () => import('../views/private/Usuarios/CreateEditUsuarioView.vue'),
      meta: {
        menu: false,
        title: 'Crear Usuario',
        isPrivate: true,
        isShared: false,
        icon: 'pi-book',
        roles: ['Administrador'],
      },
    },
    {
      path: '/usuarios/editar/:idPersona',
      name: 'editar usuario',
      component: () => import('../views/private/Usuarios/CreateEditUsuarioView.vue'),
      meta: {
        menu: false,
        title: 'Editar Usuario',
        isPrivate: true,
        isShared: false,
        icon: 'pi-book',
        roles: ['Administrador'],
      },
    },
    {
      path: '/logs',
      name: 'administrar logs',
      component: () => import('../views/private/Log/LogView.vue'),
      meta: {
        menu: true,
        title: 'Administrar Logs',
        isPrivate: true,
        isShared: false,
        icon: 'pi-file',
        roles: ['Administrador'],
      },
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('../components/Perfil/PerfilDetallesItem.vue'),
      meta: {
        menu: true,
        title: 'Perfil',
        isPrivate: true,
        isShared: false,
        icon: 'pi-user',
        roles: ['Intercambiador'],
      }
    },
    {
      path: '/perfil/editar/',
      name: 'perfil editar',
      component: () => import('../views/private/Perfil/EditPerfilView.vue'),
      meta: {
        menu: false,
        title: 'Perfil',
        isPrivate: true,
        isShared: false,
        icon: 'pi-user',
        roles: ['Intercambiador'],
      }
    },
    {
      path: '/contacto',
      name: 'contacto',
      component: () => import('../views/public/ContactoView.vue'),
      meta: {
        menu: true,
        title: 'Contacto',
        isPrivate: false,
        isShared: true,
        icon: 'pi-envelope',
      },
    },
    {
      path: '/:matchPath(.*)',
      name: '404',
      component: () => import('../views/error/404View.vue'),
      meta: { menu: false, title: 'Not Found', isPrivate: false, isShared: true, icon: 'pi-home' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.name === '404' || to.name === 'inicio') {
    next()
    return
  }

  const accountStore = useAccountStore()

  if (to.meta.isPrivate && !accountStore.isLoggedIn) {
    next({ name: 'login' })
    return
  }

  const userRole =
    accountStore.user?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? ''
  const roles = to.meta?.roles ?? []

  if (!to.meta.isPrivate && accountStore.isLoggedIn && !to.meta.isShared) {
    next({ name: 'inicio' })
  } else if (
    accountStore.isLoggedIn &&
    to.meta.isPrivate &&
    !roles.includes(userRole) &&
    !to.meta.isShared
  ) {
    next({ name: 'inicio' })
  } else {
    next()
  }
})

export default router
