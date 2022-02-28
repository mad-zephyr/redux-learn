import httpService from './http.service'

const todosEndPoint = 'todos/'
const setRandom = () =>{
	return Math.random()
}
const todosService = {
	fetch: async () => {
		const {data} = await httpService.get(todosEndPoint, {
			params:{
				_page: 1,
				_limit: 10
			}
		})
		return data
	},
	post: async () => {
		const {data} = await httpService.post(todosEndPoint, {
			userId: 1, 
			title: 'JSONPlaceholder with any other language.', 
			completed: true
		})
		return data
	}
}

export default todosService