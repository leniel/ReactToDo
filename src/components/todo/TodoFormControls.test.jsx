import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from './TodoFormWithFormik';

vi.mock('formik', () => ({
    Form: ({ children }) => <form>{children}</form>,
    Field: ({ component, name, values }) => component({
        field: { value: values?.[name] ?? null },
        form: { errors: {}, touched: {} },
    }),
    withFormik: () => Component => Component,
}));

vi.mock('@mui/x-date-pickers/DateTimePicker', () => ({
    DateTimePicker: ({ label, value }) => <input aria-label={label} value={value?.toISOString() || ''} readOnly />,
}));

test('Today and Tomorrow choose 5 PM on the corresponding local day; No due date clears it', async () => {
    const user = userEvent.setup();
    const setFieldValue = vi.fn();
    render(<TodoForm
        dirty={false} isValid values={{ name: '', description: '', dueDate: null, category: '', priority: 1 }} errors={{}}
        resetTodo={vi.fn()} handleChange={vi.fn()} submitForm={vi.fn()} isSubmitting={false} setFieldValue={setFieldValue}
    />);

    await user.click(screen.getByRole('button', { name: 'Today' }));
    let [, dueDate, shouldValidate] = setFieldValue.mock.calls.at(-1);
    let chosenDate = new Date(dueDate);
    expect(setFieldValue).toHaveBeenLastCalledWith('dueDate', expect.any(String), true);
    expect(chosenDate.getDate()).toBe(new Date().getDate());
    expect(chosenDate.getHours()).toBe(17);
    expect(shouldValidate).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Tomorrow' }));
    dueDate = setFieldValue.mock.calls.at(-1)[1];
    chosenDate = new Date(dueDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(chosenDate.getDate()).toBe(tomorrow.getDate());
    expect(chosenDate.getHours()).toBe(17);

    await user.click(screen.getByRole('button', { name: 'No due date' }));
    expect(setFieldValue).toHaveBeenLastCalledWith('dueDate', null, true);
});
