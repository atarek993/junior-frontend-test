import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addTask,
  deleteTask,
  persistTasks,
  setPriorityFilter,
  toggleTaskCompletion,
  updateTask,
} from './redux/tasksSlice'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const { tasks, filter } = useSelector((state) => state.tasksState)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [editTaskId, setEditTaskId] = useState(null)

  useEffect(() => {
    persistTasks(tasks)
  }, [tasks])

  const visibleTasks = useMemo(() => {
    if (filter === 'All') {
      return tasks
    }
    return tasks.filter((task) => task.priority === filter)
  }, [tasks, filter])

  const resetForm = () => {
    setTitle('')
    setPriority('Medium')
    setEditTaskId(null)
  }

  const onSubmitTask = (event) => {
    event.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    if (editTaskId) {
      dispatch(
        updateTask({
          id: editTaskId,
          title: trimmedTitle,
          priority,
        }),
      )
      resetForm()
      return
    }

    dispatch(
      addTask({
        id: crypto.randomUUID(),
        title: trimmedTitle,
        priority,
        completed: false,
      }),
    )
    resetForm()
  }

  const onStartEdit = (task) => {
    setTitle(task.title)
    setPriority(task.priority)
    setEditTaskId(task.id)
  }

  return (
    <main className="container">
      <h1>Task Manager</h1>

      <form className="task-form" onSubmit={onSubmitTask}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          aria-label="Select task priority"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit">{editTaskId ? 'Update Task' : 'Add Task'}</button>
        {editTaskId && (
          <button type="button" onClick={resetForm} className="cancel-button">
            Cancel Edit
          </button>
        )}
      </form>

      <section className="filters">
        {['All', 'High', 'Medium', 'Low'].map((filterOption) => (
          <button
            key={filterOption}
            type="button"
            className={filter === filterOption ? 'active-filter' : ''}
            onClick={() => dispatch(setPriorityFilter(filterOption))}
          >
            {filterOption}
          </button>
        ))}
      </section>

      <ul className="tasks-list">
        {visibleTasks.length === 0 && (
          <li className="empty-state">No tasks for selected filter.</li>
        )}
        {visibleTasks.map((task) => (
          <li key={task.id} className="task-item">
            <label className="task-checkbox">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => dispatch(toggleTaskCompletion(task.id))}
              />
              <span className={task.completed ? 'completed' : ''}>{task.title}</span>
            </label>

            <div className="task-meta-actions">
              <span className={`priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <button type="button" onClick={() => onStartEdit(task)}>
                Edit
              </button>
              <button
                type="button"
                className="delete-button"
                onClick={() => dispatch(deleteTask(task.id))}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
