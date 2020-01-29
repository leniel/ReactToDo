import React, { Component } from 'react';
import TodoList from './TodoList';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TodoForm from './TodoForm';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    control: {
        padding: theme.spacing(0),
    },
}));

export default function Main()
{
    const [spacing, setSpacing] = React.useState(2);
    const classes = useStyles();

    // const todos = this.state.todos.map(todo => <TodoItem key={todo.id} item={todo} handleChange={this.handleChange} />)

    return (

        <main className="Main">

            <Grid container className={classes.root} spacing={5}>
                <Grid container>
                    <Grid container justify="center" spacing={spacing}>
                        <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    <TodoForm />
                                </Paper>
                        </Grid>
                        
                        <Grid item xs={4}>
                            <Paper className={classes.paper}>
                                <TodoList />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* <TodoList /> */}

        </main>

    )
}