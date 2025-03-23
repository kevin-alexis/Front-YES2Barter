<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref('')

const sendResetLink = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    success.value = 'Se ha enviado un enlace de recuperación a tu correo electrónico.'
    email.value = ''
  } catch (err) {
    error.value = 'No se pudo enviar el enlace de recuperación. Por favor, inténtalo de nuevo.'
    console.error('Error al enviar enlace de recuperación:', err)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="forgot-password-container">
    <div class="card">
      <div class="card-header">
        <h1>Recuperar contraseña</h1>
      </div>
      <div class="card-body">
        <p class="instructions">
          Introduce tu correo electrónico y te enviaremos instrucciones para restablecer tu
          contraseña.
        </p>
        <form @submit.prevent="sendResetLink">
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Introduce tu correo electrónico"
              required
            />
          </div>
          <div class="alert alert-error" v-if="error">
            {{ error }}
          </div>
          <div class="alert alert-success" v-if="success">
            {{ success }}
          </div>
          <div class="actions">
            <button type="submit" class="btn-primary" :disabled="isLoading">
              <span v-if="isLoading">Enviando...</span>
              <span v-else>Enviar enlace</span>
            </button>
            <router-link to="/login" class="btn-link">Volver al inicio de sesión</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background);
  padding: 1rem;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-gradient));
  padding: 1.5rem;
  color: white;
  text-align: center;
}

.card-header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.card-body {
  padding: 2rem;
}

.instructions {
  margin-bottom: 1.5rem;
  color: #666;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(168, 208, 141, 0.2);
}

.alert {
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.alert-error {
  background-color: rgba(229, 57, 53, 0.1);
  color: var(--danger);
  border: 1px solid var(--danger);
}

.alert-success {
  background-color: rgba(62, 190, 62, 0.1);
  color: var(--success);
  border: 1px solid var(--success);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--primary-gradient);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-link {
  text-align: center;
  color: var(--tertiary);
  text-decoration: none;
  font-size: 0.9rem;
}

.btn-link:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .card {
    border-radius: 0;
    box-shadow: none;
  }

  .card-body {
    padding: 1.5rem;
  }
}
</style>
