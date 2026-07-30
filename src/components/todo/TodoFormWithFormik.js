import React, { useEffect } from "react";
import * as Yup from 'yup';
import { Button, MenuItem, LinearProgress, TextField } from '@mui/material';
import { Form, Field, withFormik } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Grid from '@mui/material/Grid';
import { priority } from '../constants';

const TodoForm = props =>
{
    let input = null;

    useEffect(() =>
    {
        console.log('rendered!');

        if (input)
        {
            input.focus();
        }

    }, [props.todo]);

    const fieldSize = 12;

    const { dirty, isValid, resetTodo, handleChange, values, errors, touched, submitForm, isSubmitting, setFieldValue } = props;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Form>
                <Grid container direction="column" justifyContent="flex-start" spacing={4}>

                    <Grid item xl={fieldSize} md={fieldSize} sm={fieldSize} xs={fieldSize}>
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
                            inputRef={(i) => { input = i; }}
                        />
                    </Grid>

                    <Grid item xl={fieldSize} md={fieldSize} sm={fieldSize} xs={fieldSize}>
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
                                    onChange={date => setFieldValue("dueDate", date ? date.toISOString() : null)}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xl={fieldSize} md={fieldSize} sm={fieldSize} xs={fieldSize}>
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
                    </Grid>

                    {isSubmitting && <LinearProgress />}

                    <Grid item xl={fieldSize} md={fieldSize} sm={fieldSize} xs={fieldSize} align="center">
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
                    </Grid>
                </Grid>
            </Form>
        </LocalizationProvider>
    );
};

export default TodoForm;

let schema = Yup.object({
    name: Yup.string().max(30, 'Must be 30 characters or less').required('Required'),
    dueDate: Yup.date().required('Required').typeError('Required'),
    priority: Yup.number().required('Required')
});

export const EnhancedTodoForm = withFormik({
    mapPropsToValues: (props) => ({
        id: props.todo.id,
        name: props.todo.name,
        dueDate: props.todo.dueDate,
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
    handleSubmit: (values, { props, resetForm }) =>
    {
        console.log('Submitting todo form...');
        props.onSubmit(values);
        resetForm();
    },
    displayName: 'TodoForm',
})(TodoForm);