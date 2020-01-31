import React, { Component } from 'react';
import EnhancedTable from './EnhancedTable'

export default class TodoList extends Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return (

            <>
                
                <EnhancedTable
                    todos={this.props.todos}
                    deleteTodo={this.props.deleteTodo}
                    completeTodo={this.props.completeTodo}
                />

            </>

        )
    }
}