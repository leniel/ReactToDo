import React, { Component } from 'react';
import TodoList from './TodoList';

class Main extends Component
{
    constructor()
    {
        super()

        this.state = {
            loading: false
        }

        this.handleChange = this.handleChange.bind(this)
    }

    bootstrapData()
    {
        this.setState({
            loading: true
        })
    }

    handleChange(id)
    {
        // console.log('Changed', id)

        // this.setState(prevState =>
        // {
        //     const updatedTodos = prevState.todos.map(todo =>
        //     {
        //         if (todo.id === id)
        //         {
        //             todo.completed = !todo.completed
        //         }

        //         return todo
        //     })

        //     return {
        //         todos: updatedTodos
        //     }
        // })
    }

    render()
    {
        // const todos = this.state.todos.map(todo => <TodoItem key={todo.id} item={todo} handleChange={this.handleChange} />)

        return (
            <main className="Main">

                <div class="todo-list">

                    <TodoList />

                </div>

            </main>
        )
    }
}

export default Main;