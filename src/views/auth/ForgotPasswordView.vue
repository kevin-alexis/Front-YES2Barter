<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAccountStore } from '@/stores/account'
import { RouterLink } from 'vue-router'
import { reactive } from 'vue'

const accountStore = useAccountStore()

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup.string().email('Correo inválido').required('El correo es requerido'),
  }),
})

const [email] = defineField('email', {
  validateOnModelUpdate: true,
})

const formData = reactive({
  email,
})

const handleSubmitForm = handleSubmit((values) => {
  try {
    accountStore.forgotPassword({ email: values.email })
  } catch (error) {
    console.error('Error al enviar enlace de recuperación:', error)
    alert('No se pudo enviar el enlace de recuperación. Por favor, inténtalo de nuevo.')
  }
})
</script>

<template>
  <div class="min-h-screen bg-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div
      class="max-w-md w-full space-y-8 bg-white shadow-lg rounded-xl border border-green-100 p-8"
    >
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-green-800">Recuperar Contraseña</h2>
        <p class="mt-2 text-sm text-green-600">
          Introduce tu correo y te enviaremos instrucciones para restablecer tu contraseña
        </p>
      </div>

      <BaseForm
        v-model:model="formData"
        v-model:errors="errors"
        @submit="handleSubmitForm"
        :config="{
          inputs: [
            {
              label: 'Correo Electrónico',
              type: 'email',
              isRequired: true,
              model: 'email',
            },
          ],
          titleButton: 'Enviar Enlace',
        }"
      >
        <template #linkBottom>
          <p>
            ¿Ya tienes cuenta?
            <RouterLink class="font-semibold text-[var(--primary)] cursor-pointer" to="/login">
              Iniciar sesión
            </RouterLink>
          </p>
        </template>
      </BaseForm>
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
