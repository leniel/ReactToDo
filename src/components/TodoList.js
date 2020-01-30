import React, { Component } from 'react';
import TodoItem from './TodoItem';
import ApiService from "../service/TodoService";

export default class TodoList extends Component
{
    constructor(props)
    {
        super(props)
    }

    componentDidMount()
    {
        
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

                {console.log(this.props.todos)}
                
                <div className="todo-list">
                    {this.props.todos.map(todo => (
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