import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './tasksSlice'

const store = configureStore({
  reducer: {
    tasksState: tasksReducer,
  },
})

export default store
