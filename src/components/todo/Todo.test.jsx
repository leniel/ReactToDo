import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Todo from './Todo';

const { api, toast } = vi.hoisted(() => ({
    api: { getTodos: vi.fn(), addTodo: vi.fn(), editTodo: vi.fn(), deleteTodo: vi.fn() },
    toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

vi.mock('../../service/TodoService', () => ({ default: api }));
vi.mock('../AxiosInterceptor', () => ({ GlobalLoader: () => null }));
vi.mock('react-toastify', () => ({ ToastContainer: () => null, toast }));
vi.mock('./TodoFormWithFormik', () => ({
    EnhancedTodoForm: ({ onSubmit, todo }) => (
        <button onClick={() => onSubmit({
            ...todo, name: todo.id ? 'Edited todo' : 'New todo', description: 'Details',
            dueDate: null, priority: 1, category: 'Work',
        })}>{todo.id ? 'Save edit' : 'Add todo'}</button>
    ),
}));
vi.mock('./EnhancedTable', () => ({
    default: props => (
        <section>
            <input aria-label="Search todos" value={props.searchFilter} onChange={e => props.searchTodo(e.target.value)} />
            <select aria-label="Status" value={props.statusFilter} onChange={e => props.onStatusFilterChange(e.target.value)}>
                {['all', 'active', 'completed', 'overdue', 'dueSoon'].map(status => <option key={status}>{status}</option>)}
            </select>
            <select aria-label="Category" value={props.categoryFilter} onChange={e => props.onCategoryFilterChange(e.target.value)}>
                <option value="">All categories</option><option>Work</option><option value="__uncategorized">Uncategorized</option>
            </select>
            <output aria-label="Counts">{JSON.stringify(props.statusCounts)}</output>
            <ul>{props.todos.map(todo => <li key={todo.id}>
                <span>{todo.name}</span>
                <button onClick={() => props.loadTodo(todo.id)}>Edit {todo.name}</button>
                <button onClick={() => props.requestDelete([todo.id])}>Delete {todo.name}</button>
            </li>)}</ul>
        </section>
    ),
}));

const todayDueDate = new Date();
todayDueDate.setHours(17, 0, 0, 0);
const yesterdayDueDate = new Date(todayDueDate);
yesterdayDueDate.setDate(yesterdayDueDate.getDate() - 1);
const existingTodos = [
    { id: 1, name: 'Overdue task', description: 'old detail', dueDate: yesterdayDueDate.toISOString(), priority: 1, category: 'Work', completed: false },
    { id: 2, name: 'Today task', description: '', dueDate: todayDueDate.toISOString(), priority: 2, category: '', completed: false },
    { id: 3, name: 'Completed task', description: '', dueDate: null, priority: 0, category: 'Work', completed: true },
];

beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    api.getTodos.mockResolvedValue({ data: existingTodos });
    api.addTodo.mockImplementation(async item => ({ data: { ...item, id: 4 } }));
    api.editTodo.mockResolvedValue({});
    api.deleteTodo.mockResolvedValue({});
});

test('loads todos and provides status counts', async () => {
    render(<Todo />);
    expect(await screen.findByText('Overdue task')).toBeInTheDocument();
    expect(api.getTodos).toHaveBeenCalledOnce();
    expect(screen.getByLabelText('Counts')).toHaveTextContent('"all":3');
    expect(screen.getByLabelText('Counts')).toHaveTextContent('"overdue":1');
    expect(screen.getByLabelText('Counts')).toHaveTextContent('"dueSoon":1');
});

test('filters by status, category, and searchable task details', async () => {
    const user = userEvent.setup();
    render(<Todo />);
    await screen.findByText('Overdue task');
    await user.selectOptions(screen.getByLabelText('Status'), 'completed');
    expect(screen.getByText('Completed task')).toBeInTheDocument();
    expect(screen.queryByText('Today task')).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Status'), 'all');
    await user.selectOptions(screen.getByLabelText('Category'), 'Work');
    expect(screen.queryByText('Today task')).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Category'), '');
    await user.type(screen.getByRole('textbox', { name: 'Search todos' }), 'old detail');
    expect(screen.getByText('Overdue task')).toBeInTheDocument();
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
});

test('creates and edits todos with notes and category without sending a user field', async () => {
    const user = userEvent.setup();
    render(<Todo />);
    await screen.findByText('Overdue task');
    await user.click(screen.getByRole('button', { name: 'Add todo' }));
    await waitFor(() => expect(api.addTodo).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New todo', description: 'Details', category: 'Work', dueDate: null,
    })));
    expect(api.addTodo.mock.calls[0][0]).not.toHaveProperty('user');
    expect(await screen.findByText('New todo')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit Overdue task' }));
    await user.click(screen.getByRole('button', { name: 'Save edit' }));
    await waitFor(() => expect(api.editTodo).toHaveBeenCalledWith(expect.objectContaining({ id: 1, description: 'Details', category: 'Work' })));
});

test('confirms deletion and lets the user undo before the delay expires', async () => {
    const user = userEvent.setup();
    render(<Todo />);
    await screen.findByText('Overdue task');
    await user.click(screen.getByRole('button', { name: 'Delete Overdue task' }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/You can undo this for 5 seconds/)).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByText('Overdue task')).toBeInTheDocument();
    expect(api.deleteTodo).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Delete Overdue task' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.queryByText('Overdue task')).not.toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: 'Undo' }));
    expect(screen.getByText('Overdue task')).toBeInTheDocument();
    expect(api.deleteTodo).not.toHaveBeenCalled();
});

test('deletes after the undo window and restores the task when the API fails', async () => {
    const user = userEvent.setup();
    render(<Todo />);
    await screen.findByText('Overdue task');
    await user.click(screen.getByRole('button', { name: 'Delete Overdue task' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    api.deleteTodo.mockRejectedValueOnce(new Error('network error'));
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 5100)); });
    await waitFor(() => expect(api.deleteTodo).toHaveBeenCalledWith(1));
    expect(await screen.findByText('Overdue task')).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalled();
}, 10000);
