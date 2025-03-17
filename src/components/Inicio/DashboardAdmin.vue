<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useObjetoStore } from '@/stores/objeto'
import { useAccountStore } from '@/stores/account'
import { usePropuestaIntercambioStore } from '../../stores/propuestaIntercambio';
import { EstatusPropuestaIntercambio } from '../../common/enums/enums';
import Chart from 'primevue/chart';
import { useCategoriaStore } from '@/stores/categoria';

const objetoStore = useObjetoStore()
const accountStore = useAccountStore()
const propuestaIntercambioStore = usePropuestaIntercambioStore()
const categoriaStore = useCategoriaStore()

const chartDataPropuestaEstatus = ref({
  labels: ['Aceptada', 'Rechazada'],
  datasets: [
    {
      label: 'Propuestas por Estatus',
      backgroundColor: ['#4caf50', '#f44336'],
      data: [0, 0],
    },
  ],
})

const chartDataObjetosCategorias = ref({
  labels: [],
  datasets: [
    {
      label: 'Objetos por Categoría',
      backgroundColor: [],
      data: [],
    },
  ],
});

onMounted(async () => {
  await propuestaIntercambioStore.getAll()
  await objetoStore.getAll()
  await accountStore.getAll()
  await  categoriaStore.getAll()

  const categoriasContador: Record<string, number> = {};

  const obtenerColor = () => {
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  objetoStore.list.forEach((objeto) => {
    const categoria = categoriaStore.list.find((item) => item.id === objeto.idCategoria);
    if (categoria) {
      if (categoriasContador[categoria.nombre]) {
        categoriasContador[categoria.nombre]++;
      } else {
        categoriasContador[categoria.nombre] = 1;
      }
    }
  });

  const categoriasLabels = Object.keys(categoriasContador);
  const categoriasData = Object.values(categoriasContador);

  chartDataObjetosCategorias.value.labels = categoriasLabels;
  chartDataObjetosCategorias.value.datasets[0].data = categoriasData;

  const colores = categoriasLabels.map(() => obtenerColor());
  chartDataObjetosCategorias.value.datasets[0].backgroundColor = colores;

  const estatusContador = {
    [EstatusPropuestaIntercambio.ACEPTADA]: 0,
    [EstatusPropuestaIntercambio.RECHAZADA]: 0,
  }

  propuestaIntercambioStore.list.forEach((propuesta) => {
    if (propuesta.estado === Object.values(EstatusPropuestaIntercambio).indexOf(EstatusPropuestaIntercambio.ACEPTADA)) {
      estatusContador[EstatusPropuestaIntercambio.ACEPTADA]++
    } else if (propuesta.estado === Object.values(EstatusPropuestaIntercambio).indexOf(EstatusPropuestaIntercambio.RECHAZADA)) {
      estatusContador[EstatusPropuestaIntercambio.RECHAZADA]++
    }
  })

  chartDataPropuestaEstatus.value.datasets[0].data = [
    estatusContador[EstatusPropuestaIntercambio.ACEPTADA],
    estatusContador[EstatusPropuestaIntercambio.RECHAZADA],
  ]

})

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div>
    <!-- Grid for managing proposals and users -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5 mx-5 sm:mx-10 mt-10">
      <div
        class="flex flex-col justify-center items-center gap-5 bg-gradient-to-t from-[var(--primary)] to-[var(--primary-gradient)] h-60 p-10 rounded-2xl text-center"
      >
        <h1 class="text-3xl sm:text-4xl font-bold text-white">Administrar Propuestas de Intercambios</h1>
        <RouterLink :to="{ name: 'administrar propuestas intercambios' }">
          <button
            id="scrollButton2"
            @click="scrollToTop"
            class="cursor-pointer mt-5 px-8 py-3 bg-white text-[var(--primary)] rounded-full hover:bg-gray-100 transition duration-200"
          >
            Gestionar Propuestas de Intercambios
          </button>
        </RouterLink>
      </div>

      <div
        class="flex flex-col justify-center items-center gap-5 bg-gradient-to-t from-[var(--primary)] to-[var(--primary-gradient)] h-60 p-10 rounded-2xl text-center"
      >
        <h1 class="text-3xl sm:text-4xl font-bold text-white">Administrar Usuarios</h1>
        <RouterLink :to="{ name: 'administrar usuarios' }">
          <button
            id="scrollButton3"
            @click="scrollToTop"
            class="cursor-pointer mt-5 px-8 py-3 bg-white text-[var(--primary)] rounded-full hover:bg-gray-100 transition duration-200"
          >
            Gestionar Usuarios
          </button>
        </RouterLink>
      </div>
    </div>

    <div class="flex flex-col justify-center items-center gap-5 h-full mx-5 sm:mx-10 mt-10 rounded-2xl">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full">
        <div
          class="bg-white p-5 rounded-2xl shadow-md text-center border border-gray-200 hover:shadow-lg transition-all duration-200"
        >
          <h3 class="font-bold text-xl sm:text-2xl">Total de Propuestas de Intercambios</h3>
          <p class="text-3xl sm:text-4xl">{{ propuestaIntercambioStore.list.length }}</p>
        </div>

        <div
          class="bg-white p-5 rounded-2xl shadow-md text-center border border-gray-200 hover:shadow-lg transition-all duration-200"
        >
          <h3 class="font-bold text-xl sm:text-2xl">Total de Objetos</h3>
          <p class="text-3xl sm:text-4xl">{{ objetoStore.list.length }}</p>
        </div>

        <div
          class="bg-white p-5 rounded-2xl shadow-md text-center border border-gray-200 hover:shadow-lg transition-all duration-200"
        >
          <h3 class="font-bold text-xl sm:text-2xl">Total de Usuarios</h3>
          <p class="text-3xl sm:text-4xl">{{ accountStore.list.length }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row w-full px-5 sm:px-10 pt-10 gap-10">
      <div class="w-full sm:w-1/2 pb-10 sm:pb-0">
        <h3 class="font-bold text-2xl text-center pb-5">Objetos por Categoría</h3>
        <Chart type="bar" :data="chartDataObjetosCategorias" :options="{ responsive: true, maintainAspectRatio: false }" />
      </div>
      <div class="w-full sm:w-1/2">
        <h3 class="font-bold text-2xl text-center pb-5">Propuestas por Estatus</h3>
        <Chart type="bar" :data="chartDataPropuestaEstatus" :options="{ responsive: true, maintainAspectRatio: false }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}

.chart-container {
  height: 400px;
  width: 100%;
}
</style>
