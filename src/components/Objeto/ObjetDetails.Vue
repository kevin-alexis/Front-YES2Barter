<script setup>
  import { ref, computed } from 'vue';
  import Card from 'primevue/card';
  import Button from 'primevue/button';
  import Avatar from 'primevue/avatar';
  import Rating from 'primevue/rating';
  import Dropdown from 'primevue/dropdown';
  
  // Datos de ejemplo
  const producto = ref({
    nombre: 'Bicicleta de Montaña Trek',
    foto: '/api/placeholder/600/400',
    descripcion: 'Bicicleta de montaña semi-nueva en excelente estado. Incluye suspensión delantera, cambios Shimano de 21 velocidades y frenos de disco. Ideal para rutas de montaña y senderos.',
    fecha: new Date(2024, 2, 5),
    precio: 350,
    vendedor: {
      nombre: 'Carlos Ramírez',
      avatar: '/api/placeholder/100/100',
      biografia: 'Ciclista aficionado y entusiasta del deporte al aire libre. Vendo artículos deportivos en excelente estado y a precios accesibles.',
      calificacion: 4
    },
    opciones: [
      { nombre: 'Talla M - Color Rojo', valor: 'M-rojo', precio: 350 },
      { nombre: 'Talla L - Color Negro', valor: 'L-negro', precio: 380 },
      { nombre: 'Talla XL - Color Azul', valor: 'XL-azul', precio: 400 }
    ]
  });
  
  const opcionSeleccionada = ref(null);
  
  // Precio actualizado según la opción seleccionada
  const precioActual = computed(() => {
    return opcionSeleccionada.value ? opcionSeleccionada.value.precio : producto.value.precio;
  });
  
  // Funciones de formato
  const formatearFecha = (fecha) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(fecha);
  };
  
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(precio);
  };
  </script>
<template>
    <div class="card">
      <div class="grid">
        <!-- Panel izquierdo -->
        <div class="col-12 md:col-6 p-3">
          <Card class="h-full">
            <template #title>
              <div class="text-2xl font-bold mb-3">{{ producto.nombre }}</div>
            </template>
            <template #content>
              <div class="product-details">
                <div class="mb-4">
                  <img :src="producto.foto" :alt="producto.nombre" class="w-full rounded-md shadow-md" />
                </div>
                <div class="mb-4">
                  <div class="font-bold mb-2">Descripción</div>
                  <p>{{ producto.descripcion }}</p>
                </div>
                <div>
                  <div class="font-bold mb-1">Fecha de publicación</div>
                  <p>{{ formatearFecha(producto.fecha) }}</p>
                </div>
              </div>
            </template>
          </Card>
        </div>
  
        <!-- Panel derecho -->
        <div class="col-12 md:col-6 p-3">
          <Card class="h-full">
            <template #content>
              <div class="seller-info mb-4">
                <div class="flex align-items-center mb-3">
                  <Avatar :image="producto.vendedor.avatar" class="mr-3" size="large" shape="circle" />
                  <div>
                    <div class="text-xl font-bold">{{ producto.vendedor.nombre }}</div>
                    <Rating v-model="producto.vendedor.calificacion" :cancel="false" readonly />
                  </div>
                </div>
                <div class="biografía mb-4">
                  <div class="font-bold mb-2">Biografía</div>
                  <p>{{ producto.vendedor.biografia }}</p>
                </div>
              </div>
  
              <div class="options mb-4">
                <div class="font-bold mb-2">Seleccione una opción</div>
                <Dropdown
                  v-model="opcionSeleccionada"
                  :options="producto.opciones"
                  optionLabel="nombre"
                  placeholder="Seleccione variante"
                  class="w-full"
                />
              </div>
  
              <div class="pricing mb-4">
                <div class="flex justify-content-between align-items-center">
                  <div class="font-bold text-lg">Precio:</div>
                  <div class="text-2xl font-bold text-primary">{{ formatearPrecio(precioActual) }}</div>
                </div>
              </div>
  
              <div class="action-buttons">
                <Button label="Hacer oferta" icon="pi pi-shopping-cart" class="w-full mb-2" />
                <Button label="Añadir a favoritos" icon="pi pi-heart" class="w-full p-button-outlined" />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </template>
  
  
  
  <style scoped>
  .product-details p {
    line-height: 1.5;
    color: #495057;
  }
  
  .biografía p {
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  .text-primary {
    color: #3B82F6;
  }
  </style>