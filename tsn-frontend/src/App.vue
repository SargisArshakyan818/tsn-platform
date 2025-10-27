<template>
  <v-app>
    <!-- App Toolbar -->
    <v-app-bar color="primary" dark>
      <v-toolbar-title>Task Scheduling Platform</v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="user">
        {{ user.name }}
        <v-btn text @click="logout">Logout</v-btn>
      </div>
    </v-app-bar>

    <!-- Main content -->
    <v-main>
      <v-container class="mt-6" fluid>
        <!-- Login/Register Modal -->
        <LoginModal v-if="!user" @loginSuccess="onLoginSuccess" />

        <!-- Task Board -->
        <template v-else>
          <!-- Task Board -->
          <VRow>
              <TaskCard :task="task" />
          </VRow>
        </template>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import TaskCard from './components/TaskCard.vue'
import LoginModal from './components/LoginForm.vue'
import { fetchTasks } from './api/api'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

socket.on(`notification_admin@example.com`, (data: any) => {
  alert(`🔔 ${data.message}`)
})

interface User {
  id: number
  name: string
  email: string
}

const tasks = ref<any[]>([])
const user = ref<User | null>(null)

// Load tasks from API
async function loadTasks() {
  try {
    const { data } = await fetchTasks()
    tasks.value = data
  } catch (err) {
    console.error('Failed to fetch tasks', err)
  }
}

// Handle successful login/register
function onLoginSuccess(loggedInUser: User, token: string) {
  user.value = loggedInUser
  localStorage.setItem('token', token)
  localStorage.setItem('user', user.value.email)
  loadTasks()
}

// Logout user
function logout() {
  user.value = null
  localStorage.removeItem('token')
}

// Check if user is already logged in
onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    user.value = { id: 1, name: 'Test User', email: localStorage.getItem('user')! }
    loadTasks()
  }
})
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
