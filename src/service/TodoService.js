import axios from 'axios';
import { ax } from './../components/AxiosInterceptor'

const TODO_API_BASE_URL = 'http://localhost:7777/api/TodoItems';

class ApiService
{
    getTodos()
    {
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