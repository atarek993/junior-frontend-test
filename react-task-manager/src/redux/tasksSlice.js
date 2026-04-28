import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'task-manager-tasks'

const loadTasks = () => {
  try {
    const rawTasks = localStorage.getItem(STORAGE_KEY)
    if (!rawTasks) {
      return []
    }

    const parsedTasks = JSON.parse(rawTasks)
    return Array.isArray(parsedTasks) ? parsedTasks : []
  } catch {
    return []
  }
}

const initialState = {
  tasks: loadTasks(),
  filter: 'All',
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.unshift(action.payload)
    },
    updateTask: (state, action) => {
      const { id, title, priority } = action.payload
      const taskToUpdate = state.tasks.find((task) => task.id === id)

      if (taskToUpdate) {
        taskToUpdate.title = title
        taskToUpdate.priority = priority
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
    },
    toggleTaskCompletion: (state, action) => {
      const taskToToggle = state.tasks.find((task) => task.id === action.payload)
      if (taskToToggle) {
        taskToToggle.completed = !taskToToggle.completed
      }
    },
    setPriorityFilter: (state, action) => {
      state.filter = action.payload
    },
  },
})

export const persistTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  setPriorityFilter,
} = tasksSlice.actions

export default tasksSlice.reducer
