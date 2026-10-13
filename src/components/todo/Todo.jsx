import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { EnhancedTodoForm } from './TodoFormWithFormik';
import ApiService from '../../service/TodoService';
import EnhancedTable from './EnhancedTable';
import { toast } from 'react-toastify';
import { getUser } from '../../auth/Auth';

const createEmptyTodo = () => ({ name: '', dueDate: null, priority: '' });

export default function Todo() {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState(createEmptyTodo);
    const [filter, setFilter] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        let active = true;

        getUser().then(currentUser => {
            if (active) setUser(currentUser);
        });

        ApiService.getTodos().then(response => {
            if (active) setTodos(response.data);
        });

        return () => {
            active = false;
        };
    }, []);

    const addTodo = newTodo => {
        const todoWithUser = { ...newTodo, user: user.email };

        ApiService.addTodo(todoWithUser).then(response => {
            setTodos(currentTodos => [...currentTodos, response.data]);
            toast.success('Todo saved.', { position: 'top-center' });
        });
    };

    const editTodo = editedTodo => {
        ApiService.editTodo(editedTodo).then(() => {
            setTodos(currentTodos => currentTodos.map(currentTodo =>
                currentTodo.id === editedTodo.id ? editedTodo : currentTodo));
            setTodo(createEmptyTodo());
            toast.success('Todo edited.', { position: 'top-center' });
        });
    };

    const saveTodo = todoToSave => {
        todoToSave.id ? editTodo(todoToSave) : addTodo(todoToSave);
    };

    const resetTodo = () => setTodo(createEmptyTodo());

    const searchTodo = search => setFilter(search);

    const loadTodo = id => {
        if (!id) {
            setTodo(createEmptyTodo());
            return;
        }

        setTodo(todos.find(currentTodo => currentTodo.id === id) ?? createEmptyTodo());
    };

    const deleteTodo = ids => {
        ids.forEach(id => {
            ApiService.deleteTodo(id).then(response => {
                setTodos(currentTodos => currentTodos.filter(currentTodo =>
                    currentTodo.id !== response.data.id));
                toast.success('Todo deleted.', { position: 'top-center' });
            });
        });
    };

    const completeTodo = ids => {
        const changedTodos = todos
            .filter(currentTodo => ids.includes(currentTodo.id))
            .map(currentTodo => ({ ...currentTodo, completed: !currentTodo.completed }));

        Promise.all(changedTodos.map(changedTodo => ApiService.editTodo(changedTodo)))
            .then(() => {
                setTodos(currentTodos => currentTodos.map(currentTodo =>
                    ids.includes(currentTodo.id)
                        ? { ...currentTodo, completed: !currentTodo.completed }
                        : currentTodo));
                toast.success('Todo(s) complete changed.', { position: 'top-center' });
            });
    };

    const todosToShow = filter
        ? todos.filter(currentTodo => currentTodo.name.toLowerCase().includes(filter.toLowerCase()))
        : todos;

    return (
        <Grid container justifyContent="flex-end" spacing={2}>
            <Grid size={{ xs: 12, lg: 4 }} sx={{ mt: 2 }}>
                <Paper sx={{ px: 2 }}>
                    <EnhancedTodoForm
                        onSubmit={saveTodo}
                        todo={todo}
                        resetTodo={resetTodo} />
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
                <Paper sx={{ px: 2 }}>
                    <EnhancedTable
                        todos={todosToShow}
                        deleteTodo={deleteTodo}
                        completeTodo={completeTodo}
                        loadTodo={loadTodo}
                        searchTodo={searchTodo}
                    />
                </Paper>
            </Grid>
        </Grid>
    );
}
