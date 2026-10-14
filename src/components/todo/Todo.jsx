import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import { EnhancedTodoForm } from './TodoFormWithFormik';
import ApiService from '../../service/TodoService';
import EnhancedTable from './EnhancedTable';
import { toast, ToastContainer } from 'react-toastify';
import { GlobalLoader } from '../AxiosInterceptor';
import 'react-toastify/dist/ReactToastify.css';
import { categories } from '../constants';
import { filterTodosByStatus, getTodoStatusCounts } from './todoUtils';

const createEmptyTodo = () => ({ name: '', description: '', dueDate: null, priority: '', category: '' });

export default function Todo() {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState(createEmptyTodo);
    const [filter, setFilter] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [deleteConfirmationIds, setDeleteConfirmationIds] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const pendingDeleteRef = useRef(null);
    const deleteTimerRef = useRef(null);

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

    const finishDelete = async pending => {
        try {
            await Promise.all(pending.todos.map(item => ApiService.deleteTodo(item.id)));
            toast.success(pending.todos.length === 1 ? 'Todo deleted.' : 'Todos deleted.', { position: 'top-center' });
        } catch {
            setTodos(currentTodos => [
                ...currentTodos,
                ...pending.todos.filter(item => !currentTodos.some(current => current.id === item.id))
            ]);
            toast.error('Delete failed. The todo(s) were restored.', { position: 'top-center' });
        } finally {
            if (pendingDeleteRef.current === pending) {
                pendingDeleteRef.current = null;
                setPendingDelete(null);
                deleteTimerRef.current = null;
            }
        }
    };

    const requestDelete = ids => setDeleteConfirmationIds(ids);

    const confirmDelete = () => {
        const itemsToDelete = todos.filter(currentTodo => deleteConfirmationIds.includes(currentTodo.id));
        setDeleteConfirmationIds(null);
        if (!itemsToDelete.length) return;

        if (pendingDeleteRef.current) {
            clearTimeout(deleteTimerRef.current);
            void finishDelete(pendingDeleteRef.current);
        }

        const pending = { todos: itemsToDelete };
        pendingDeleteRef.current = pending;
        setPendingDelete({ count: itemsToDelete.length });
        setTodos(currentTodos => currentTodos.filter(currentTodo => !itemsToDelete.some(item => item.id === currentTodo.id)));
        deleteTimerRef.current = window.setTimeout(() => {
            if (pendingDeleteRef.current === pending) {
                pendingDeleteRef.current = null;
                deleteTimerRef.current = null;
                setPendingDelete(null);
            }
            void finishDelete(pending);
        }, 5000);
    };

    const undoDelete = () => {
        const pending = pendingDeleteRef.current;
        if (!pending) return;

        clearTimeout(deleteTimerRef.current);
        pendingDeleteRef.current = null;
        deleteTimerRef.current = null;
        setPendingDelete(null);
        setTodos(currentTodos => [
            ...currentTodos,
            ...pending.todos.filter(item => !currentTodos.some(current => current.id === item.id))
        ]);
        toast.info('Delete undone.', { position: 'top-center' });
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

    const todosToShow = filterTodosByStatus(todos, statusFilter)
        .filter(currentTodo => !categoryFilter
            || (categoryFilter === '__uncategorized' ? !currentTodo.category : currentTodo.category === categoryFilter))
        .filter(currentTodo => {
            if (!filter) return true;
            const search = filter.toLowerCase();
            return [currentTodo.name, currentTodo.description, currentTodo.category]
                .some(value => value?.toLowerCase().includes(search));
        });
    const statusCounts = getTodoStatusCounts(todos);

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
                            requestDelete={requestDelete}
                            completeTodo={completeTodo}
                            loadTodo={loadTodo}
                            searchTodo={searchTodo}
                            searchFilter={filter || ''}
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                            statusCounts={statusCounts}
                            categoryFilter={categoryFilter}
                            onCategoryFilterChange={setCategoryFilter}
                            categories={categories}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <Dialog open={Boolean(deleteConfirmationIds)} onClose={() => setDeleteConfirmationIds(null)}>
                <DialogTitle>Delete {deleteConfirmationIds?.length === 1 ? 'todo' : 'todos'}?</DialogTitle>
                <DialogContent>
                    {deleteConfirmationIds?.length === 1
                        ? 'This todo will be removed. You can undo this for 5 seconds.'
                        : `${deleteConfirmationIds?.length} todos will be removed. You can undo this for 5 seconds.`}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmationIds(null)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={Boolean(pendingDelete)}
                message={`${pendingDelete?.count === 1 ? 'Todo' : `${pendingDelete?.count} todos`} deleted`}
                action={<Button color="inherit" size="small" onClick={undoDelete}>Undo</Button>}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </>
    );
}
