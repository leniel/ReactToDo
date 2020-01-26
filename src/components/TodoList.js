import React, { Component } from 'react';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

const uri = 'http://localhost:7777/api/';

export default class TodoList extends Component
{
    state = {
        todos: [],
        // todoToShow: "all",
        // toggleAllComplete: true
    }

    componentDidMount()
    {
        fetch("http://localhost:7777/api/TodoItems")
            .then(response => response.json())
            .then(data => 
            {
                debugger;

                this.setState(
                    {
                        //loading: false,
                        todos: data
                    })
            })
    }

    addTodo = todo =>
    {
        this.setState(
            {
                todos: [todo, ...this.state.todos]
            }
        )

        fetch(uri + "TodoItems", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        }).catch(error => console.error('Unable to add item.', error));
    }

    deleteTodo = id =>
    {
        this.setState(state => ({
            todos: state.todos.filter(todo => todo.id !== id)
        }));
    };

    render()
    {
        return (
            <div>
                <TodoForm onSubmit={this.addTodo} />

                {this.state.todos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        toggleComplete={() => this.toggleComplete(todo.id)}
                        onDelete={() => this.deleteTodo(todo.id)}
                        todo={todo}
                    />
                ))}
            </div>
        )
    }
}