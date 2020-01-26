import React, {Component} from 'react';

class TodoItem extends Component
{
    constructor()
    {
        super()
    }

    render()
    {
        const completedStyle = {
            fontStyle: "italic",
            color: "gray",
            textDecoration: "line-through"
        }

        return (
            <div className="todo-item">
                
                <input
                    type="checkbox"
                    checked={this.props.item.completed}
                    onChange={() => this.props.handleChange(this.props.item.id)}></input>
                
                <p style={this.props.item.completed ? completedStyle : null}>{this.props.item.text}</p>
            </div>
        );
    }
}

export default TodoItem;