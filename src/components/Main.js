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
                    let { todos } = this.state;

                    todos.pop(res.data);

                    this.setState({ todos: todos });
            })
        })
    }

    render()
    {
        let { todos } = this.state;

        return (

            <main className="Main">

                <Grid container justify="center" alignItems="center" spacing={2} xs={12}>
                    <Grid item xs={4}>
                        <Paper>
                            <TodoForm onSubmit={this.addTodo} />
                        </Paper>
                    </Grid>

                    <Grid item xs={5}>
                        <Paper>
                            <TodoList todos={todos} deleteTodo={this.deleteTodo} />
                        </Paper>
                    </Grid>
                </Grid>

            </main>
        )
    }
}

export default withTheme(Main);