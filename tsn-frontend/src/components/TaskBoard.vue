<template>
  <v-container>
    <!-- Create Task Button -->
    <v-btn color="primary" @click="openModal('create')">Create Task</v-btn>

    <!-- Task Modal -->
    <TaskModal
      v-if="modal.visible"
      :mode="modal.mode"
      :task="modal.task"
      @close="closeModal"
      @taskSaved="fetchAPITasks"
    />

    <!-- Task Grid -->
    <v-row>
      <v-col v-for="task in tasks" :key="task.id" cols="12" sm="6" md="4">
        <TaskCard
          :task="task"
          @edit="openModal('edit', task)"
          @delete="removeTask(task.id)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import TaskCard from "./TaskCard.vue";
import TaskModal from "./TaskModal.vue";
import { fetchTasks, deleteTask } from "../api/api";

// -------------------
// 🧩 Types
// -------------------
interface Task {
  id: number;
  title: string;
  description: string;
  status?: string;
  assignee?: string;
  due_date?: string;
}

interface ModalState {
  visible: boolean;
  mode: "create" | "edit";
  task: Task | null;
}

// -------------------
// 🧩 Reactive State
// -------------------
const tasks = ref<Task[]>([]);
const modal = ref<ModalState>({
  visible: false,
  mode: "create",
  task: null,
});

// -------------------
// 🧩 Methods
// -------------------
async function fetchAPITasks() {
  try {
    const { data } = await fetchTasks();
    tasks.value = data;
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
  }
}

function openModal(mode: "create" | "edit", task: Task | null = null) {
  modal.value = { visible: true, mode, task };
}

function closeModal() {
  modal.value.visible = false;
}

async function removeTask(id: number) {
  if (confirm("Delete this task?")) {
    try {
      await deleteTask(id);
      await fetchAPITasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }
}

// -------------------
// 🧩 Lifecycle
// -------------------
onMounted(fetchAPITasks);
</script>
