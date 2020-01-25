import React, { Component } from 'react';
import TodoItem from './TodoItem';
import todosData from '../data/todosData';

class Main extends Component
{
    constructor()
    {
        super()

        this.state = {
            todos: todosData
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(id)
    {
        console.log('Changed', id)

        this.setState(prevState =>
        {
            const updatedTodos = prevState.todos.map(todo =>
            {
                if (todo.id === id)
                {
                    todo.completed = !todo.completed
                }

                return todo
            })

            return {
                todos: updatedTodos
            }
        })
    }

    render()
    {
        const todos = this.state.todos.map(todo => <TodoItem key={todo.id} item={todo} handleChange={this.handleChange} />)

        return (
            <main className="Main">

                <div class="todo-list">
                    {todos}
                </div>

            </main>
        )
    }
}

export default Main;