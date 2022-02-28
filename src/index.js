import React, { useEffect }  from 'react'
import ReactDOM from 'react-dom'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { getErrors } from './store/errors'

import configureStore from './store/store'
import { 
  titleChanged, 
  taskDeleted, 
  completeTask,
  loadTasks,
  getTasksLoadingStatus,
  getTasks,
  uploadTask
} from './store/task'

const store = configureStore()

const App = () => {
  const state = useSelector(getTasks())
  const isLoading = useSelector(getTasksLoadingStatus())
  const error = useSelector(getErrors())
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadTasks(1, 5))
  }, [])

  const changeTitle = (taskId) => {
    dispatch(titleChanged(taskId))
  }

  const deleteTask = (taskId) => {
    dispatch(taskDeleted(taskId))
  }

  const style = {margin: '2px 2px '}
  const tasks = state.map(task => (
    <li key={task.id}> 
      <span>{task.title} {`${task.completed}`}
        <button style={style} onClick={() => dispatch(completeTask(task.id))}>Click</button>
        <button style={style} onClick={() => changeTitle(task.id)}>Change</button>
        <button style={style} onClick={() => deleteTask(task.id)}>Delete</button>
      </span>
    </li>
  ))

  if (isLoading) {
    return <h1> Loading...</h1>
  }
  if (error) {
    return <h1> {error}</h1>
  }
  
  return <>
    <h1>App</h1> 
    <ul>
      {tasks}
    </ul>

    <button
      onClick={() => dispatch(uploadTask())}> 
      Add more Tasks
    </button>
  </>
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);