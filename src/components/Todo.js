import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TodoForm from './TodoForm';
import ApiService from "../service/TodoService";
import { withTheme } from '@material-ui/core/styles';
import EnhancedTable from './EnhancedTable'

const emptyTodo = { name: '', dueDate: null, priority: '' }

class Main extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            todos: [],
            todo: emptyTodo
        }
    }

    async componentDidMount()
    {
        // Get todos from Web API
        ApiService.getTodos()
            .then((res) =>
            {
                this.setState({ todos: res.data })
            });
    }

    saveTodo = todo =>
    {
        //debugger;

        // Existing todo?
        todo.id ? this.editTodo(todo) : this.addTodo(todo)
    }

    addTodo = todo =>
    {
        ApiService.addTodo(todo).then(
            res =>
            {
                console.log('Todo saved', 2, res)

                let { todos } = this.state;

                todos.push(res.data);

                this.setState({ todos: todos });
            }
        )
    }

    editTodo = editedTodo =>
    {
        //debugger;

        console.log('Editing todo with id = ' + editedTodo.id)

        ApiService.editTodo(editedTodo).then(
            res =>
            {
                console.log('Todo edit saved', 2, res)

                let { todos } = this.state;

                const newTodos = todos.map(todo => todo.id === editedTodo.id ? editedTodo : todo)

                this.setState({
                    todos: newTodos,
                    todo: emptyTodo
                });
            }
        )
    }

    loadTodo = id =>
    {
        if (id)
        {
            console.log('Loading todo with id = ' + id)

            const { todos } = this.state

            let todo = todos.find(todo => todo.id === id)

            //debugger;

            this.setState({ todo: todo });
        }
        else
        {
            this.setState({ todo: emptyTodo });
        }
    }

    deleteTodo = ids =>
    {
        console.log('ids to be deleted', ids)

        ids.map(id =>
        {
            ApiService.deleteTodo(id).then
                (res =>
                {
                    let deletedTodo = res.data;

                    this.setState(prevState => ({
                        todos: prevState.todos.filter(todo => todo.id != deletedTodo.id)
                    }));
                })
        })
    }

    completeTodo = ids =>
    {
        console.log('ids to be completed', ids)

        const { todos } = this.state

        ids.map(id =>
        {
            let todo = todos.find(todo => todo.id === id)

            todo.completed = !todo.completed

            ApiService.editTodo(todo).then(
                res =>
                {
                    console.log('Todo completed', id)

                    this.setState(prevState => ({
                        todos: todos
                    }));
                })
        })
    }

    render()
    {
        let { todos, todo } = this.state;

        // console.log(this.props.theme.Paper)

        return (

            <Grid container justify="flex-end" alignItems="center" spacing={2} lg={12}>
                    <Grid item xs={12} lg={4}>
                        <Paper style={this.props.theme.Paper}>
                            <TodoForm onSubmit={this.saveTodo} todo={todo} />
                        </Paper>
                    </Grid>

                    {/* {console.log(todos)} */}

                    <Grid item xs={12} lg={6}>
                        <Paper style={this.props.theme.Paper}>

                            <EnhancedTable
                                todos={todos}
                                deleteTodo={this.deleteTodo}
                                completeTodo={this.completeTodo}
                                loadTodo={this.loadTodo}
                            />
                        </Paper>
                    </Grid>
                </Grid>
        )
    }
}

export default withTheme(Main);