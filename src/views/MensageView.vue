<template>
  <div class="chat-container">
      <div class="messages">
          <div v-for="mensaje in mensajes" :key="mensaje.idMensaje"
               :class="{'mine': mensaje.idEmisor === usuarioId}">
              {{ mensaje.contenido }}
          </div>
      </div>
      <input v-model="nuevoMensaje" placeholder="Escribe tu mensaje..." />
      <button @click="enviarMensaje">Enviar</button>
  </div>
</template>

<script>
import mensajeService from '../services/mensajeService';

export default {
  data() {
      return {
          mensajes: [],
          nuevoMensaje: '',
          usuarioId: 1, // ID del usuario actual (Ejemplo)
          receptorId: 2 // ID del receptor (Ejemplo)
      };
  },
  async mounted() {
      this.mensajes = (await mensajeService.obtenerMensajes(this.usuarioId, this.receptorId)).data;
  },
  methods: {
      async enviarMensaje() {
          if (!this.nuevoMensaje.trim()) return;

          const mensaje = {
              idEmisor: this.usuarioId,
              idReceptor: this.receptorId,
              contenido: this.nuevoMensaje
          };

          await mensajeService.enviarMensaje(mensaje);
          this.mensajes.push(mensaje);
          this.nuevoMensaje = '';
      }
  }
};
</script>

<style>
.chat-container {
  width: 400px;
  margin: auto;
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
.messages {
  height: 300px;
  overflow-y: scroll;
  border-bottom: 1px solid #ccc;
  padding: 5px;
}
.mine {
  text-align: right;
  background: lightblue;
}
</style>
