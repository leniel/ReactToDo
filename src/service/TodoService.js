import ax from './../components/AxiosInterceptor'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:8888')).replace(/\/+$/, '');
const TODO_API_BASE_URL = `${API_BASE_URL}/api/TodoItems`;

class ApiService
{
    getTodos()
    {
        //debugger;

        return ax.get(TODO_API_BASE_URL);
    }

    getTodoById(todoId)
    {
        return ax.get(TODO_API_BASE_URL + '/' + todoId);
    }

    deleteTodo(todoId)
    {
        return ax.delete(TODO_API_BASE_URL + '/' + todoId);
    }

    addTodo(todo)
    {
        return ax.post(TODO_API_BASE_URL, todo)
    }

    editTodo(todo)
    {
        return ax.put(TODO_API_BASE_URL + '/' + todo.id, todo);
    }

}

export default new ApiService();
