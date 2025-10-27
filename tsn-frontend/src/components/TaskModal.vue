<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>Create Task</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="Title" v-model="title" required />
          <v-textarea label="Description" v-model="description" />
          <v-menu v-model="startMenu" :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
  <v-text-field
    v-bind="props"
    label="Start Date"
    v-model="startDate"
    readonly
  />
</template>
            <v-date-picker v-model="startDate" @update:model-value="startMenu = false" />
          </v-menu>
          <v-menu v-model="endMenu" :close-on-content-click="false" offset-y>
            <template #activator="{ props }">
  <v-text-field
    v-bind="props"
    label="End Date"
    v-model="endDate"
    readonly
  />
</template>
            <v-date-picker v-model="endDate" @update:model-value="endMenu = false" />
          </v-menu>
          <v-select :items="users" item-title="name" item-value="id" label="Assignee" v-model="assigneeId as any" required />
          <v-select :items="statuses" label="Status" v-model="status" required />
          <v-alert v-if="error" type="error">{{ error }}</v-alert>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="submit">Create</v-btn>
        <v-btn text color="grey" @click="emit('close')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { fetchUsers, createTask, updateTask, checkAvailability } from '../api/api'

const props = defineProps<{ mode: 'create' | 'edit'; task?: any }>()
const emit = defineEmits(['close', 'taskSaved'])

const dialog = ref(true)
const title = ref('')
const description = ref('')
const startDate = ref('')
const endDate = ref('')
const assigneeId = ref<number | null>(null)
const status = ref('todo')
const error = ref('')
const startMenu = ref(false)
const endMenu = ref(false)

const users = ref([])
const statuses = ['todo', 'in-progress', 'done']

onMounted(async () => {
  const { data } = await fetchUsers()
  users.value = data
  if (props.mode === 'edit' && props.task) {
    title.value = props.task.title
    description.value = props.task.description
    startDate.value = props.task.startDate
    endDate.value = props.task.endDate
    assigneeId.value = props.task.assigneeId
    status.value = props.task.status
  }
})

async function submit() {
  if (!assigneeId.value) return

  const { data: available } = await checkAvailability(assigneeId.value, startDate.value, endDate.value)
  if (!available.available) {
    error.value = 'User not available during selected dates'
    return
  }

  const payload = {
    title: title.value,
    description: description.value,
    startDate: startDate.value,
    endDate: endDate.value,
    assigneeId: assigneeId.value,
    status: status.value,
  }

  if (props.mode === 'edit' && props.task) {
    await updateTask(props.task.id, payload)
  } else {
    await createTask(payload)
  }

  emit('taskSaved')
  emit('close')
} 
</script>
