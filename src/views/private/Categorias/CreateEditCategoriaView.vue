<script setup lang="ts">
import BaseForm from '@/components/BaseForm.vue'
import { useCategoriaStore } from '@/stores/categoria'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import * as yup from 'yup'
import { useForm } from 'vee-validate'

const categoriaStore = useCategoriaStore()
const route = useRoute()
const isEdit = ref(false)
const idCategoria = ref('')

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: yup.object({
    nombre: yup.string().required('El nombre es obligatorio'),
  }),
})

const [nombre] = defineField('nombre', {
  validateOnModelUpdate: true,
})

const contactForm = reactive({
  nombre: nombre,
})

const handleSubmitForm = handleSubmit((values: FormValues) => {
  if (!isEdit.value) {
    categoriaStore.create(values)
  } else {
    categoriaStore.update(idCategoria.value, values)
  }
})

onMounted(async () => {
  isEdit.value = route.fullPath.includes('editar')
  if (isEdit.value) {
    idCategoria.value = route.params.id as string
    await categoriaStore.getById(idCategoria.value).then((response) => {
      Object.assign(contactForm, response)
    })
  }
})

onMounted(async () => {})
</script>

<template>
  <div class="p-5 w-full">
    <BaseForm
      class="max-w-4xl mx-auto p-5 sm:p-8 md:p-10 lg:p-12"
      v-model:model="contactForm"
      v-model:errors="errors"
      @submit="handleSubmitForm"
      :config="{
        inputs: [
          {
            label: 'Nombre',
            type: 'text',
            isRequired: true,
            model: 'nombre',
          },
        ],
        titleButton: isEdit ? 'Editar' : 'Crear',
        isCanceled: true,
      }"
    >
      <template #headerForm>
        <h1 class="text-[var(--primary)] text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          {{ isEdit ? 'Editar' : 'Crear' }} Categoría
        </h1>
      </template>
    </BaseForm>
  </div>
</template>
