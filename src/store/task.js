import { createSlice } from '@reduxjs/toolkit'
import todosService from '../services/todo.service'
import { setError } from './errors'
import { nanoid } from '@reduxjs/toolkit'

const initialState = {entities:[], isLoading: true}

const taskSlice = createSlice({
	name:"task", 
	initialState, 
	reducers: {
		recived(state, action){
			console.log(action.payload)
			state.entities = action.payload
			state.isLoading = false
		},
		createTask(state, action){
			state.entities.push(action.payload)
			state.isLoading = false
		},
		update(state, action){
			const elemIndex = state.entities.findIndex(el => el.id === action.payload.id)
			state.entities[elemIndex] = {...state.entities[elemIndex], title: action.payload.title}
		},
		complete(state, action) {
			const elemIndex = state.entities.findIndex(el => el.id === action.payload.id)
			state.entities[elemIndex]['completed'] = true
		},
		remove(state, action){
			state.entities = state.entities.filter(el => el.id !== action.payload.id)
		},
		taskRequested(state) {
			state.isLoading = true
		},
		taskRequestFailed(state) {
			state.isLoading = false
		}
}})

const { actions, reducer: taskReducer } = taskSlice
const { update, complete, remove, recived, taskRequestFailed, taskRequested, createTask } = actions


export const loadTasks = () => async (dispatch) => {
	dispatch(taskRequested())
	try {
		const data = await todosService.fetch()
		dispatch(recived(data))
		return data
	} catch (error) {
		dispatch(taskRequestFailed())
		dispatch(setError(error.message))
	}
}

export const uploadTask = () => async (dispatch) => {
	dispatch(taskRequested())
	try {
		const data = await todosService.post()
		data.id = nanoid()
		dispatch(createTask(data))
		return data
	} catch (error) {
		dispatch(taskRequestFailed())
		dispatch(setError(error.message))
	}
}

export const completeTask = (id) => (dispatch) => {
	dispatch(update({id, completed: true}))
}
export function taskCompleted(id) {
	return update({id, completed: true})
}
export function titleChanged(id){
	return complete({id, title: `New title: ${id}`})
}
export function taskDeleted(id){
	return remove({id})
}

export const getTasks = () => (state) => state.tasks.entities
export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading

export default taskReducer