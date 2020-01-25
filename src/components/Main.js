import React, { Component } from 'react';
import TodoItem from './TodoItem';
import TodoData from '../data/todosData';

class Main extends Component
{
    render()
    {
        const todos = TodoData.map(todo => <TodoItem key={todo.id} item={todo} />)

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