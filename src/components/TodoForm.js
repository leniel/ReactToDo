import React from "react"
import * as Yup from 'yup';
import { Button, MenuItem, LinearProgress, TextField } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Grid from '@material-ui/core/Grid';

function TodoForm()
{
    const priority = [
        {
            value: 0,
            label: "Low"
        },
        {
            value: 1,
            label: "Normal"
        },
        {
            value: 2,
            label: "High"
        }
    ];

    const fieldSize = 12

    return (

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Formik
                validateOnMount={false} // Can validate the form up front with true
                validateOnChange={true}
                validateOnBlur={true}
                initialValues={{ name: '', dueDate: null, priority: '' }}

                validationSchema={Yup.object({
                    name:
                        Yup.string()
                            .max(30, 'Must be 30 characters or less')
                            .required('Required'),
                    dueDate:
                        Yup.date()
                            .required('Required')
                            .typeError('Required'),
                    priority:
                        Yup.number()
                            .required('Required')
                })}

                onSubmit={(values, { setSubmitting, resetForm }) =>
                {
                    debugger;

                    //values.priority = parseInt(values.priority)

                    //alert(JSON.stringify(values, null, 2));

                    // Resets form after submission is complete
                    resetForm()
                }}
            >
                {props =>
                {
                    const { handleChange, values, errors, touched, handleSubmit, submitForm, isSubmitting, setFieldValue } = props;
                    return (

                        <Form>

                            <Grid container direction="column" justify="flex-start" spacing={4}>

                                <Grid item xl={fieldSize} md={fieldSize} sm={fieldSize} xs={fieldSize}>
                                    <TextField
                                        autoFocus={true}
                                        fullWidth
                                        name='name'
                                        label='Todo'
                                        variant="outlined"
                                        onChange={handleChange("name")}
                                        helperText={errors.name ? errors.name : "Describe your todo"}
                                        error={errors.name}
                                        touched={touched.name}
                                        value={values.name}
                                    />
                                </Grid>

                                <Grid item xl={fieldSize} md={fieldSize} sm={fieldSize} xs={fieldSize}>
                                    <Field
                                        name="dueDate"
                                        label="Due date"
                                        inputVariant="outlined"
                                        helperText={errors.dueDate ? errors.dueDate : "When should it be done?"}
                                        disablePast
                                        clearable
                                        fullWidth
                                        component={DateTimePicker}
                                        value={values.dueDate}
                                        error={errors.dueDate}
                                        touched={touched.dueDate}
                                        onChange={date => setFieldValue("dueDate", date.toISOString())} />
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
                                        helperText={errors.priority ? errors.priority : "How urgent is this?"}
                                        error={errors.priority}
                                        touched={touched.priority}
                                        value={values.priority}
                                    >
                                        {priority.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                </Grid>

                                <Grid item xl={fieldSize}
                                    md={fieldSize}
                                    sm={fieldSize}
                                    xs={fieldSize}
                                    align="center" justify="center">

                                    {isSubmitting && <LinearProgress />}

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                    >
                                        Save
          </Button>
                                </Grid> </Grid>

                            {/* Useful during debugging - it shows all Formik props */}
                            {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}

                        </Form>

                    );
                }}

            </Formik>

        </MuiPickersUtilsProvider>
    )
}

export default TodoForm