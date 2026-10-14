import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnhancedTable from './EnhancedTable';

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const today = new Date();
const todos = [
    { id: 1, name: 'Overdue task', description: 'Review the release', dueDate: yesterday.toISOString(), priority: 2, category: 'Work', completed: false },
    { id: 2, name: 'Today task', dueDate: today.toISOString(), priority: 1, category: '', completed: false },
    { id: 3, name: 'No date task', dueDate: null, priority: 0, category: 'Personal', completed: false },
    { id: 4, name: 'Completed task', dueDate: yesterday.toISOString(), priority: 0, category: '', completed: true },
];

const makeProps = overrides => ({
    todos,
    statusFilter: 'all',
    statusCounts: { all: 4, active: 3, completed: 1, overdue: 1, dueSoon: 1 },
    categoryFilter: '',
    categories: ['Work', 'Personal'],
    searchFilter: '',
    onStatusFilterChange: vi.fn(),
    onCategoryFilterChange: vi.fn(),
    searchTodo: vi.fn(),
    requestDelete: vi.fn(),
    completeTodo: vi.fn(),
    loadTodo: vi.fn(),
    ...overrides,
});

test('shows task details, categories, no-date text, and urgency indicators', () => {
    render(<EnhancedTable {...makeProps()} />);

    const overdueRow = screen.getByText('Overdue task').closest('tr');
    expect(within(overdueRow).getByText('Review the release')).toBeInTheDocument();
    expect(within(overdueRow).getByText('Work')).toBeInTheDocument();
    expect(within(overdueRow).getByText('Overdue')).toBeInTheDocument();
    expect(within(screen.getByText('Today task').closest('tr')).getByText('Due today')).toBeInTheDocument();
    expect(within(screen.getByText('No date task').closest('tr')).getByText('No date')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'All (4)' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overdue (1)' })).toBeInTheDocument();
});

test('sends status and category filter selections to the parent', async () => {
    const user = userEvent.setup();
    const props = makeProps();
    render(<EnhancedTable {...props} />);

    await user.click(screen.getByRole('tab', { name: 'Due soon (1)' }));
    expect(props.onStatusFilterChange).toHaveBeenCalledWith('dueSoon');

    await user.click(screen.getByRole('combobox', { name: 'Category' }));
    await user.click(await screen.findByRole('option', { name: 'Work' }));
    expect(props.onCategoryFilterChange).toHaveBeenCalledWith('Work');
});

test('bulk delete sends the selected task ids to the confirmation callback', async () => {
    const user = userEvent.setup();
    const props = makeProps();
    render(<EnhancedTable {...props} />);

    const row = screen.getByText('Overdue task').closest('tr');
    await user.click(within(row).getByRole('checkbox'));
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'delete' }));
    expect(props.requestDelete).toHaveBeenCalledWith([1]);
});
