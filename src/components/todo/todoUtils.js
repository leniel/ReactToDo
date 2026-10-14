const startOfToday = (date = new Date()) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
};

export const isOverdue = (todo, now = new Date()) => {
    if (todo.completed || !todo.dueDate) return false;
    return startOfToday(new Date(todo.dueDate)) < startOfToday(now);
};

export const isDueSoon = (todo, now = new Date()) => {
    if (todo.completed || !todo.dueDate) return false;
    const today = startOfToday(now);
    const dueDay = startOfToday(new Date(todo.dueDate));
    const endOfWindow = new Date(today);
    endOfWindow.setDate(endOfWindow.getDate() + 7);
    return dueDay >= today && dueDay < endOfWindow;
};

export const getTodoDueStatus = (todo, now = new Date()) => {
    if (todo.completed || !todo.dueDate) return null;
    const dueDay = startOfToday(new Date(todo.dueDate));
    const today = startOfToday(now);
    if (dueDay < today) return 'overdue';
    if (dueDay.getTime() === today.getTime()) return 'today';
    return null;
};

export const getTodoStatusCounts = (todos, now = new Date()) => ({
    all: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length,
    overdue: todos.filter(todo => isOverdue(todo, now)).length,
    dueSoon: todos.filter(todo => isDueSoon(todo, now)).length,
});

export const filterTodosByStatus = (todos, status, now = new Date()) => {
    switch (status) {
        case 'active': return todos.filter(todo => !todo.completed);
        case 'completed': return todos.filter(todo => todo.completed);
        case 'overdue': return todos.filter(todo => isOverdue(todo, now));
        case 'dueSoon': return todos.filter(todo => isDueSoon(todo, now));
        default: return todos;
    }
};
