<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="4">
        <LoginForm @loginSuccess="onLoginSuccess" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import LoginForm from '../components/LoginForm.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
function onLoginSuccess() { router.push('/') }
</script>
