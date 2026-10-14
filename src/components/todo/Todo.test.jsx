import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Todo from './Todo';

const { api, getUser } = vi.hoisted(() => ({
    api: {
        getTodos: vi.fn(),
        addTodo: vi.fn(),
        editTodo: vi.fn(),
        deleteTodo: vi.fn(),
    },
    getUser: vi.fn(),
}));

vi.mock('../../auth/Auth', () => ({ getUser }));
vi.mock('../../service/TodoService', () => ({ default: api }));
vi.mock('../AxiosInterceptor', () => ({
    GlobalLoader: () => <div data-testid="global-loader" />,
}));
vi.mock('react-toastify', () => ({
    ToastContainer: () => <div data-testid="toast-container" />,
    toast: { success: vi.fn() },
}));
vi.mock('./TodoFormWithFormik', () => ({
    EnhancedTodoForm: ({ onSubmit, todo }) => (
        <button onClick={() => onSubmit({
            ...todo,
            name: todo.id ? 'Edited todo' : 'New todo',
            dueDate: '2026-10-13T12:00:00.000Z',
            priority: 1,
        })}>
            {todo.id ? 'Save edit' : 'Add todo'}
        </button>
    ),
}));
vi.mock('./EnhancedTable', () => ({
    default: ({ todos, searchTodo, loadTodo, deleteTodo }) => (
        <section>
            <input aria-label="Search todos" onChange={event => searchTodo(event.target.value)} />
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <span>{todo.name}</span>
                        <button onClick={() => loadTodo(todo.id)}>Edit {todo.name}</button>
                        <button onClick={() => deleteTodo([todo.id])}>Delete {todo.name}</button>
                    </li>
                ))}
            </ul>
        </section>
    ),
}));

const existingTodos = [
    { id: 1, name: 'Buy milk', dueDate: '2026-10-14T12:00:00.000Z', priority: 1 },
    { id: 2, name: 'Write notes', dueDate: '2026-10-15T12:00:00.000Z', priority: 2 },
];

beforeEach(() => {
    vi.clearAllMocks();
    getUser.mockResolvedValue({ email: 'leniel@example.com' });
    api.getTodos.mockResolvedValue({ data: existingTodos });
    api.addTodo.mockImplementation(async todo => ({ data: { ...todo, id: 3 } }));
    api.editTodo.mockResolvedValue({});
    api.deleteTodo.mockImplementation(async id => ({ data: { id } }));
});

test('loads the signed-in user and their todos', async () => {
    render(<Todo />);

    expect(await screen.findByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Write notes')).toBeInTheDocument();
    expect(getUser).toHaveBeenCalledOnce();
    expect(api.getTodos).toHaveBeenCalledOnce();
});

test('filters the visible todos by name', async () => {
    const user = userEvent.setup();
    render(<Todo />);
    await screen.findByText('Buy milk');

    await user.type(screen.getByRole('textbox', { name: 'Search todos' }), 'notes');

    expect(screen.getByText('Write notes')).toBeInTheDocument();
    expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
});

test('creates a todo for the signed-in user and adds it to the list', async () => {
    const user = userEvent.setup();
    render(<Todo />);
    await screen.findByText('Buy milk');

    await user.click(screen.getByRole('button', { name: 'Add todo' }));

    await waitFor(() => expect(api.addTodo).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New todo',
        user: 'leniel@example.com',
    })));
    expect(await screen.findByText('New todo')).toBeInTheDocument();
});

test('edits and deletes todos through the table actions', async () => {
    const user = userEvent.setup();
    render(<Todo />);
    await screen.findByText('Buy milk');

    await user.click(screen.getByRole('button', { name: 'Edit Buy milk' }));
    await user.click(screen.getByRole('button', { name: 'Save edit' }));

    await waitFor(() => expect(api.editTodo).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        name: 'Edited todo',
    })));
    expect(await screen.findByText('Edited todo')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete Edited todo' }));

    await waitFor(() => expect(screen.queryByText('Edited todo')).not.toBeInTheDocument());
    expect(api.deleteTodo).toHaveBeenCalledWith(1);
});
