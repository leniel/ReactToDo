import { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { Button, MenuItem, LinearProgress, TextField } from '@mui/material';
import { Form, Field, withFormik } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { categories, priority } from '../constants';

const TodoForm = props =>
{
    const inputRef = useRef(null);

    useEffect(() =>
    {
        inputRef.current?.focus();

    }, [props.todo]);

    const { dirty, isValid, resetTodo, handleChange, values, errors, submitForm, isSubmitting, setFieldValue } = props;

    const setQuickDueDate = daysFromToday => {
        const date = new Date();
        date.setDate(date.getDate() + daysFromToday);
        date.setHours(17, 0, 0, 0);
        setFieldValue('dueDate', date.toISOString(), true);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Form>
                <Stack spacing={4}>

                    <Box>
                        <TextField
                            autoFocus
                            fullWidth
                            name='name'
                            label='Todo'
                            variant="outlined"
                            onChange={handleChange("name")}
                            helperText={errors.name ? errors.name : "What should be done?"}
                            error={Boolean(errors.name)}
                            value={values.name}
                            inputRef={inputRef}
                        />
                    </Box>

                    <Box>
                        <Field
                            name="dueDate"
                            component={({ field, form }) => (
                                <DateTimePicker
                                    label="Due date"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: "outlined",
                                            error: Boolean(form.errors.dueDate && form.touched.dueDate),
                                            helperText: form.errors.dueDate ? form.errors.dueDate : "When should it be done?"
                                        }
                                    }}
                                    value={field.value ? new Date(field.value) : null}
                                    onChange={date => setFieldValue("dueDate", date && !Number.isNaN(date.getTime()) ? date.toISOString() : null)}
                                />
                            )}
                        />
                        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                            <Button size="small" type="button" onClick={() => setQuickDueDate(0)}>Today</Button>
                            <Button size="small" type="button" onClick={() => setQuickDueDate(1)}>Tomorrow</Button>
                            <Button size="small" type="button" onClick={() => setFieldValue('dueDate', null, true)}>No due date</Button>
                        </Stack>
                    </Box>

                    <Box>
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            maxRows={5}
                            name="description"
                            label="Notes"
                            value={values.description || ''}
                            onChange={handleChange('description')}
                            error={Boolean(errors.description)}
                            helperText={errors.description || 'Optional details'}
                        />
                    </Box>

                    <Box>
                        <TextField
                            select
                            fullWidth
                            name="category"
                            label="Category"
                            value={values.category || ''}
                            onChange={handleChange('category')}
                        >
                            <MenuItem value="">No category</MenuItem>
                            {categories.map(category => (
                                <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Box>
                        <TextField
                            select
                            name="priority"
                            id="priority"
                            label="Priority"
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange("priority")}
                            helperText={errors.priority ? errors.priority : "How urgent is it?"}
                            error={Boolean(errors.priority)}
                            value={values.priority}
                        >
                            {priority.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {isSubmitting && <LinearProgress />}

                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!dirty || !isValid}
                            onClick={submitForm}
                        >
                            Save
                        </Button>

                        <Button
                            variant="contained"
                            onClick={resetTodo}
                            type="button"
                            style={values.id ? { display: 'initial', marginLeft: '16px' } : { display: 'none' }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Stack>
            </Form>
        </LocalizationProvider>
    );
};

export default TodoForm;

let schema = Yup.object({
    name: Yup.string().max(30, 'Must be 30 characters or less').required('Required'),
    dueDate: Yup.date().nullable().typeError('Enter a valid due date'),
    description: Yup.string().max(500, 'Must be 500 characters or less'),
    category: Yup.string().max(50),
    priority: Yup.number().required('Required')
});

export const EnhancedTodoForm = withFormik({
    mapPropsToValues: (props) => ({
        id: props.todo.id,
        name: props.todo.name,
        description: props.todo.description || '',
        dueDate: props.todo.dueDate,
        category: props.todo.category || '',
        user: props.todo.user,
        priority: props.todo.priority,
        resetTodo: props.resetTodo,
        onSubmit: props.onSubmit
    }),
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    validationSchema: schema,
    handleSubmit: async (values, { props, resetForm }) =>
    {
        const saved = await props.onSubmit(values);
        if (saved) resetForm();
    },
    displayName: 'TodoForm',
})(TodoForm);
