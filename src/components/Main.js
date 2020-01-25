import React from 'react';
import ToDo from './TodoItem';
import TodoItem from './TodoItem';
import TodoData from '../data/todosData';

function Main()
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

export default Main;