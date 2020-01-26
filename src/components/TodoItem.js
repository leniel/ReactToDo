import React, { Component } from 'react';

const completedStyle = {
    fontStyle: "italic",
    color: "gray",
    textDecoration: "line-through"
}

export default props => (

    <div className="todo-item">

        <p style={props.completed ? completedStyle : null}>{props.todo.name}</p>

        <button onClick={props.onDelete}>x</button>
    </div>
)