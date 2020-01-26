import React, { Component } from "react"
import TodoItem from "./TodoItem"

export default class TodoForm extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            name: "",
            completed: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = event =>
    {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit = event =>
    {
        event.preventDefault();

        // alert('Todo submitted: ' + this.state.name);

        this.props.onSubmit({
            name: this.state.name,
            completed: false
        });

        this.setState({
            name: ""
        });
    };

    render()
    {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    placeholder="todo..."
                />
                <button onClick={this.handleSubmit}>Add todo</button>
            </form>
        )
    }
}