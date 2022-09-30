import { gql, useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'

const GET_TASKS = gql`
  query getTasks {
    tasks {
      id
      task
    }
  }
`

const ADD_TASK = gql`
  mutation addTask($task: String!) {
    addTask(task: $task) {
      id
      task
    }
  }
`

const DELETE_TASK = gql`
  mutation deleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`

const UPDATE_TASK = gql`
  mutation updateTask($task: String!, $id: ID!) {
    updateTask(task: $task, id: $id) {
      id
      task
    }
  }
`

const App = () => {
  const [newTask, setNewTask] = useState('')
  const { loading, error, data } = useQuery(GET_TASKS)
  const [addTask] = useMutation(ADD_TASK, {
    variables: { task: newTask },
    update(cache, { data: { addTask } }) {
      const { tasks } = cache.readQuery({ query: GET_TASKS })
      cache.writeQuery({
        query: GET_TASKS,
        data: { tasks: [...tasks, addTask] },
      })
    },
  })
  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache, { data: { deleteTask } }) {
      const { tasks } = cache.readQuery({ query: GET_TASKS })
      cache.writeQuery({
        query: GET_TASKS,
        data: { tasks: tasks.filter(task => task.id !== deleteTask.id) },
      })
    },
  })
  const [updateTask] = useMutation(UPDATE_TASK, {
    update(cache, { data: { updateTask } }) {
      const { tasks } = cache.readQuery({ query: GET_TASKS })
      cache.writeQuery({
        query: GET_TASKS,
        data: {
          tasks: tasks.map(task =>
            task.id === updateTask.id ? updateTask : task
          ),
        },
      })
    },
  })

  const handleSubmit = e => {
    e.preventDefault()
    addTask()
    setNewTask('')
  }

  if (loading) return <h3>Loading...</h3>
  if (error) return <h3>Something Went Wrong</h3>

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          required
        />
        <button>Add</button>
      </form>
      <ul>
        {data?.tasks?.map(task => (
          <li key={task.id}>
            {task.task}
            <button
              onClick={() => {
                deleteTask({ variables: { id: task.id } })
              }}>
              Delete
            </button>
            <button
              onClick={() => {
                updateTask({ variables: { task: newTask, id: task.id } })
              }}>
              Update
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
