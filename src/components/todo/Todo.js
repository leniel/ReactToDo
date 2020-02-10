import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { EnhancedTodoForm } from './TodoFormWithFormik';
import ApiService from "../../service/TodoService";
import { withTheme } from '@material-ui/core/styles';
import EnhancedTable from './EnhancedTable';
import { toast } from 'react-toastify';
import { getUser } from "../../auth/Auth";

const emptyTodo = { name: '', dueDate: null, priority: '' }

class Todo extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            todos: [],
            todo: emptyTodo,
            filter: null,
            user: null
        }
    }

    async componentDidMount()
    {
        let user = await getUser()

        //debugger

        // Assigning the current logged in User to the state
        this.setState({ user: user })
        
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
        //debugger

        const { user } = this.state

        // Assigning the User associated with this todo
        todo.user = user.email

        ApiService.addTodo(todo).then(
            res =>
            {
                console.log('Todo saved', 2, res)

                let { todos } = this.state;

                todos.push(res.data);

                this.setState({ todos: todos });

                toast.success("Todo saved.", {
                    position: toast.POSITION.TOP_CENTER
                });
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

                toast.success("Todo edited.", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        )
    }

    resetTodo = () =>
    {
        //debugger

        console.log('Resetting todo to empty todo...')

        this.setState({ todo: emptyTodo });
    }

    searchTodo = (search) =>
    {
        //debugger

        console.log('Searching todo with text = ' + search)

        this.setState({filter: search})
    }

    loadTodo = id =>
    {
        if (id)
        {
            console.log('Loading todo with id = ' + id)

            const { todos } = this.state

            let todo = todos.find(todo => todo.id === id)

            //debugger;

            this.setState({ todo: todo })
        }
        else
        {
            debugger

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
        const { todos, todo, filter } = this.state;

        // Filtering Todos
        const todosToShow = filter
            ? todos.filter(todo => todo.name.toLowerCase().includes(filter.toLowerCase()))
            : todos

        // console.log(this.props.theme.Paper)

        return (

            <Grid container justify="flex-end" spacing={2} lg={12}>
                <Grid item xs={12} lg={4} alignItems="center" style={{ marginTop: 16 }}>
                    <Paper style={this.props.theme.Paper}>
                        <EnhancedTodoForm
                            onSubmit={this.saveTodo}
                            todo={todo}
                            resetTodo={this.resetTodo} />
                    </Paper>
                </Grid>

                {/* {console.log(todos)} */}

                <Grid item xs={12} lg={6}>
                    <Paper style={this.props.theme.Paper}>

                        <EnhancedTable
                            todos={todosToShow}
                            deleteTodo={this.deleteTodo}
                            completeTodo={this.completeTodo}
                            loadTodo={this.loadTodo}
                            searchTodo={this.searchTodo}
                        />
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default withTheme(Todo);