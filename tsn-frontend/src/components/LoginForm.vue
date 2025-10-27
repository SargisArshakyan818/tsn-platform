<template>
  <v-dialog v-model="dialog" persistent max-width="400px">
    <v-card>
      <v-card-title>{{ isRegister ? 'Register' : 'Login' }}</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-if="isRegister" v-model="name" label="Name" required />
          <v-text-field v-model="email" label="Email" required />
          <v-text-field v-model="password" label="Password" type="password" required />
        </v-form>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="submit">{{ isRegister ? 'Register' : 'Login' }}</v-btn>
        <v-btn text @click="toggleForm">{{ isRegister ? 'Login' : 'Register' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { loginUser, registerUser } from '../api/api'

const emit = defineEmits<{
  (e: 'loginSuccess', user: any, token: string): void
}>()

const dialog = ref(true)
const isRegister = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

function toggleForm() {
  isRegister.value = !isRegister.value
  error.value = ''
}

async function submit() {
  try {
    if (isRegister.value) {
      const { data } = await registerUser({ name: name.value, email: email.value, password: password.value })
      emit('loginSuccess', data.user, data.token)
    } else {
      const { data } = await loginUser({ email: email.value, password: password.value })
      emit('loginSuccess', data.user, data.token)
    }
    dialog.value = false
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Login/Register failed'
  }
}
</script>
