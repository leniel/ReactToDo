import { describe, expect, it } from 'vitest';
import { filterTodosByStatus, getTodoDueStatus, getTodoStatusCounts, isDueSoon, isOverdue } from './todoUtils';

const now = new Date(2026, 9, 13, 12);
const todos = [
    { id: 1, dueDate: new Date(2026, 9, 12, 17).toISOString(), completed: false },
    { id: 2, dueDate: new Date(2026, 9, 13, 17).toISOString(), completed: false },
    { id: 3, dueDate: new Date(2026, 9, 19, 17).toISOString(), completed: false },
    { id: 4, dueDate: new Date(2026, 9, 20, 17).toISOString(), completed: false },
    { id: 5, dueDate: new Date(2026, 9, 12, 17).toISOString(), completed: true },
    { id: 6, dueDate: null, completed: false },
];

describe('todo due dates and status filters', () => {
    it('marks overdue and due today tasks while excluding completed and undated tasks', () => {
        expect(isOverdue(todos[0], now)).toBe(true);
        expect(getTodoDueStatus(todos[0], now)).toBe('overdue');
        expect(getTodoDueStatus(todos[1], now)).toBe('today');
        expect(isOverdue(todos[4], now)).toBe(false);
        expect(getTodoDueStatus(todos[5], now)).toBeNull();
    });

    it('includes due today through the six following days in Due soon', () => {
        expect(isDueSoon(todos[1], now)).toBe(true);
        expect(isDueSoon(todos[2], now)).toBe(true);
        expect(isDueSoon(todos[0], now)).toBe(false);
        expect(isDueSoon(todos[3], now)).toBe(false);
        expect(isDueSoon(todos[4], now)).toBe(false);
        expect(isDueSoon(todos[5], now)).toBe(false);
    });

    it('returns consistent counts and filtered task sets', () => {
        expect(getTodoStatusCounts(todos, now)).toEqual({ all: 6, active: 5, completed: 1, overdue: 1, dueSoon: 2 });
        expect(filterTodosByStatus(todos, 'active', now).map(todo => todo.id)).toEqual([1, 2, 3, 4, 6]);
        expect(filterTodosByStatus(todos, 'completed', now).map(todo => todo.id)).toEqual([5]);
        expect(filterTodosByStatus(todos, 'overdue', now).map(todo => todo.id)).toEqual([1]);
        expect(filterTodosByStatus(todos, 'dueSoon', now).map(todo => todo.id)).toEqual([2, 3]);
    });
});
