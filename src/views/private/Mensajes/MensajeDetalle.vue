<script setup lang="ts"></script>
<template>
  <div>
    Lista de chats
    <!-- Aqui cargaremos el chat, se hara un componente lista que se le pasaran todos los mensajes
      y este tendra un item que se reutilizara para escribir el mensaje (este otro componente recibe mensaje por mensaje) -->
    <MensajeList></MensajeList>
  </div>
</template>
