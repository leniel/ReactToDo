import React, { Component } from 'react';
import TodoItem from './TodoItem';
import ApiService from "../service/TodoService";

export default class TodoList extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            todos: [],
            message: null
        }

        // this.deleteTodo = this.deleteTodo.bind(this);
        // this.editTodo = this.editTodo.bind(this);
        this.addTodo = this.addTodo.bind(this);
        this.reloadTodoList = this.reloadTodoList.bind(this);
    }

    componentDidMount()
    {
        this.reloadTodoList();
    }

    reloadTodoList()
    {
        //debugger;

        ApiService.getTodos()
            .then((res) =>
            {
                this.setState({ todos: res.data })
            });
    }

    addTodo = todo =>
    {
        ApiService.addTodo(todo)

        this.reloadTodoList()
    }

    // deleteTodo = id =>
    // {
    //     this.setState(state => ({
    //         todos: state.todos.filter(todo => todo.id !== id)
    //     }));
    // };

    render()
    {
        return (

            <>

                <div className="todo-list">
                    {this.state.todos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            toggleComplete={() => this.toggleComplete(todo.id)}
                            // onDelete={() => this.deleteTodo(todo.id)}
                            todo={todo}
                        />
                    ))}
                </div>

            </>

        )
    }
}