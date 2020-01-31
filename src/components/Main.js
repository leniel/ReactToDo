import React, { Component } from 'react';
import TodoList from './TodoList';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TodoForm from './TodoForm';
import ApiService from "../service/TodoService";
import { withTheme } from '@material-ui/core/styles';

class Main extends Component
{
    constructor(props)
    {
        super(props)

        this.state = { todos: [] };
    }

    async componentDidMount()
    {
        this.reloadTodoList()
    }

    reloadTodoList()
    {
        //debugger;

        ApiService.getTodos()
            .then((res) =>
            {
                this.setState({ todos: res.data })
            });
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
        let { todos } = this.state;

        // console.log(this.props.theme.Paper)

        return (

            <main className="Main">

                <Grid container justify="center" alignItems="center" spacing={2} xs={12}>
                    <Grid item xs={12} lg={4}>
                        <Paper style={this.props.theme.Paper}>
                            <TodoForm onSubmit={this.addTodo} />
                        </Paper>
                    </Grid>

                    {/* {console.log(todos)} */}

                    <Grid item xs={12} lg={5}>
                        <Paper style={this.props.theme.Paper}>
                            <TodoList
                                todos={todos}
                                deleteTodo={this.deleteTodo}
                                completeTodo={this.completeTodo} />
                        </Paper>
                    </Grid>
                </Grid>

            </main>
        )
    }
}

export default withTheme(Main);