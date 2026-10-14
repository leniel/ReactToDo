import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { EnhancedTodoForm } from './TodoFormWithFormik';
import ApiService from '../../service/TodoService';
import EnhancedTable from './EnhancedTable';
import { toast, ToastContainer } from 'react-toastify';
import { GlobalLoader } from '../AxiosInterceptor';
import 'react-toastify/dist/ReactToastify.css';

const createEmptyTodo = () => ({ name: '', dueDate: null, priority: '' });

export default function Todo() {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState(createEmptyTodo);
    const [filter, setFilter] = useState(null);

    useEffect(() => {
        let active = true;

        ApiService.getTodos().then(response => {
            if (active) setTodos(response.data);
        }).catch(() => {});

        return () => {
            active = false;
        };
    }, []);

    const addTodo = async newTodo => {
        try {
            const response = await ApiService.addTodo(newTodo);
            setTodos(currentTodos => [...currentTodos, response.data]);
            toast.success('Todo saved.', { position: 'top-center' });
            return true;
        } catch {
            return false;
        }
    };

    const editTodo = async editedTodo => {
        try {
            await ApiService.editTodo(editedTodo);
            setTodos(currentTodos => currentTodos.map(currentTodo =>
                currentTodo.id === editedTodo.id ? editedTodo : currentTodo));
            setTodo(createEmptyTodo());
            toast.success('Todo edited.', { position: 'top-center' });
            return true;
        } catch {
            return false;
        }
    };

    const saveTodo = todoToSave => {
        return todoToSave.id ? editTodo(todoToSave) : addTodo(todoToSave);
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

    const deleteTodo = async ids => {
        try {
            await Promise.all(ids.map(id => ApiService.deleteTodo(id)));
            setTodos(currentTodos => currentTodos.filter(currentTodo => !ids.includes(currentTodo.id)));
            toast.success(ids.length === 1 ? 'Todo deleted.' : 'Todos deleted.', { position: 'top-center' });
        } catch {
            // The Axios interceptor displays the request error; keep the rows until deletion succeeds.
        }
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
            }).catch(() => {});
    };

    const todosToShow = filter
        ? todos.filter(currentTodo => currentTodo.name.toLowerCase().includes(filter.toLowerCase()))
        : todos;

    return (
        <>
            <GlobalLoader />
            <ToastContainer />
            <Grid container spacing={2} sx={{ width: '100%', mx: 'auto', px: { xs: 1, md: 2 } }}>
                <Grid size={{ xs: 12, lg: 4 }} sx={{ mt: 2 }}>
                    <Paper sx={{ px: 2 }}>
                        <EnhancedTodoForm
                            onSubmit={saveTodo}
                            todo={todo}
                            resetTodo={resetTodo} />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, lg: 8 }} sx={{ minWidth: 0 }}>
                    <Paper sx={{ px: { xs: 1, sm: 2 }, minWidth: 0 }}>
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
        </>
    );
}
