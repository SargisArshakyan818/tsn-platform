import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:3000/api', // match your backend
})

// Tasks
// export const fetchTasks = () => api.get('/tasks')
// export const createTask = (task: any) => api.post('/tasks', task)
// export const fetchUsers = () => api.get('/users')
// export const checkAvailability = (userId: number, start: string, end: string) =>
//     api.get(`/tasks/check?userId=${userId}&start=${start}&end=${end}`)

export const fetchTasks = () => api.get('/tasks')
export const fetchUsers = () => api.get('/users')
export const createTask = (data: any) => api.post('/tasks', data)
export const updateTask = (id: number, data: any) => api.put(`/tasks/${id}`, data)
export const deleteTask = (id: number) => api.delete(`/tasks/${id}`)
export const checkAvailability = (assigneeId: number, start: string, end: string) =>
    api.get(`/tasks/availability/check`, { params: { assigneeId, start, end } })

// Auth
export const registerUser = (data: { name: string; email: string; password: string }) =>
    api.post('/users', data) // backend UsersService handles password hashing

export const loginUser = (data: { email: string; password: string }) =>
    api.post('/auth/login', data)
export const getCurrentUser = () => api.get('/auth/me')
