import React, { Component } from 'react';
import EnhancedTable from './EnhancedTable'

export default class TodoList extends Component
{
    constructor(props)
    {
        super(props)
    }

    componentDidMount()
    {
        
    }

    deleteTodo()
    {
        console.log('hey jude')
        //alert(todo)

        //console.log(todo)
    }

    render()
    {
        return (

            <>

                {/* <div className="todo-list"> */}
                    {/* {this.props.todos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            toggleComplete={() => this.toggleComplete(todo.id)}
                            // onDelete={() => this.deleteTodo(todo.id)}
                            todo={todo}
                        />
                    ))} */}

                    <EnhancedTable todos={this.props.todos} deleteTodo={this.props.deleteTodo} />

                {/* </div> */}

            </>

        )
    }
}