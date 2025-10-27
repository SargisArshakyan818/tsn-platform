<template>
  <div class="task-manager">
    <h1 class="title">Task Manager</h1>

    <!-- Controls -->
    <div class="controls">
      <button class="btn" @click="openModal">+ New Task</button>

      <input
        v-model="searchQuery"
        placeholder="Search by title or description..."
        class="input"
      />

      <select v-model="sortStatus" class="input">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select v-model="sortUser" class="input">
        <option value="">All Users</option>
        <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
      </select>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Assigned User</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id">
            <td>{{ task.title }}</td>
            <td>{{ task.description || '-' }}</td>

            <!-- Editable user -->
            <td>
              <select v-model="task.assigneeId" @change="updateTask(task)">
                <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
              </select>
            </td>

            <!-- Editable status -->
            <td>
              <select v-model="task.status" @change="updateTask(task)">
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </td>

            <td>{{ formatDate(task.startDate) }}</td>
            <td>{{ formatDate(task.endDate) }}</td>

            <td class="actions">
              <button class="btn-edit" @click="editTask(task)">✏️ Edit</button>
              <button class="btn-delete" @click="deleteTask(task.id)">🗑️ Delete</button>
            </td>
          </tr>

          <tr v-if="filteredTasks.length === 0">
            <td colspan="7" class="no-tasks">No tasks found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for Add/Edit -->
    <div v-if="dialog" class="modal-overlay" @click.self="dialog = false">
      <div class="modal">
        <h2>{{ editMode ? "Edit Task" : "Create Task" }}</h2>

        <form @submit.prevent="saveTask" class="modal-form">
          <label>
            Title
            <input v-model="form.title" required />
          </label>

          <label>
            Description
            <textarea v-model="form.description"></textarea>
          </label>

          <label>
            Start Date
            <input type="date" v-model="form.startDate" required />
          </label>

          <label>
            End Date
            <input type="date" v-model="form.endDate" required />
          </label>

          <label>
            Assigned User
            <select v-model="form.assigneeId" required>
              <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
            </select>
          </label>

          <label>
            Status
            <select v-model="form.status" required>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="dialog = false">Cancel</button>
            <button type="submit" class="btn-save">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const API = "http://localhost:3000/api";

const tasks = ref<any[]>([]);
const users = ref<any[]>([]);
const dialog = ref(false);
const editMode = ref(false);

const form = ref({
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  assigneeId: "",
  status: "pending",
  id:0,
});

const sortStatus = ref("");
const sortUser = ref("");
const searchQuery = ref("");

async function fetchTasks() {
  const res = await axios.get(`${API}/tasks`);
  tasks.value = res.data;
}
async function fetchUsers() {
  const res = await axios.get(`${API}/users`);
  users.value = res.data;
}

onMounted(async () => {
  await fetchTasks();
  await fetchUsers();
});

const filteredTasks = computed(() => {
  let list = [...tasks.value];
  if (sortStatus.value) list = list.filter(t => t.status === sortStatus.value);
  if (sortUser.value) list = list.filter(t => String(t.assigneeId) === String(sortUser.value));
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
    );
  }
  return list;
});

function openModal() {
  editMode.value = false;
  Object.assign(form.value, {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    assigneeId: "",
    status: "pending",
    id: 0,
  });
  dialog.value = true;
}

function editTask(task: any) {
  editMode.value = true;
  form.value = {
    ...task,
    startDate: task.startDate ? task.startDate.split("T")[0] : "",
    endDate: task.endDate ? task.endDate.split("T")[0] : "",
  };
  dialog.value = true;
}

async function saveTask() {
  try {
    const payload = {
      ...form.value,
      startDate: new Date(form.value.startDate).toISOString(),
      endDate: new Date(form.value.endDate).toISOString(),
    };

    if (editMode.value) {
      await axios.put(`${API}/tasks/${form.value.id}`, payload);
    } else {
      await axios.post(`${API}/tasks`, payload);
    }
    dialog.value = false;
    await fetchTasks();
  } catch (err: any) {
    alert(err.response?.data?.message || "Error saving task");
  }
}


async function deleteTask(id: number) {
  if (confirm("Are you sure?")) {
    await axios.delete(`${API}/tasks/${id}`);
    await fetchTasks();
  }
}

async function updateTask(task: any) {
  try {
    await axios.put(`${API}/tasks/${task.id}`, { assigneeId: task.assigneeId, status: task.status });
  } catch {
    await fetchTasks();
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB");
}
</script>

<style scoped>
.task-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
}

.title {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.input {
  padding: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #1976d2;
  color: white;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background-color: #115293;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

th, td {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: left;
}

.actions button {
  margin-right: 0.3rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit {
  background-color: #1976d2;
  color: white;
}
.btn-edit:hover {
  background-color: #115293;
}

.btn-delete {
  background-color: #d32f2f;
  color: white;
}
.btn-delete:hover {
  background-color: #9a0007;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal {
  background: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.modal h2 {
  margin-bottom: 1rem;
}

.modal-form label {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
}

.modal-form input,
.modal-form textarea,
.modal-form select {
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-cancel {
  background: #ccc;
  color: #333;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
}

.btn-save {
  background: #1976d2;
  color: white;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }
  .table-wrapper table {
    min-width: 600px;
  }
}
</style>
