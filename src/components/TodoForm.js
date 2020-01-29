import React, { useState } from "react"
import * as Yup from 'yup';
import { FormControl, Button, MenuItem, LinearProgress, InputLabel, TextField } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { Formik, Form, Field } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DateTimePicker, DatePicker } from "@material-ui/pickers";

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

    return (

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Formik
                validateOnMount={false} // Can validate the form up front with true
                initialValues={{ name: '', duedate: new Date(), priority: '' }}

                validationSchema={Yup.object({
                    name:
                        Yup.string()
                            .max(30, 'Must be 30 characters or less')
                            .required('Required'),
                    duedate:
                        Yup.date()
                            .required('Required'),
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

                            <Container component="main" maxWidth="xs" >

                                <FormControl>
                                    <TextField
                                        name='name'
                                        label='Todo'
                                        variant="outlined"
                                        onChange={handleChange("name")}
                                        helperText="Describe your todo"
                                        error={errors.name}
                                        touched={touched.name}
                                        value={values.name}
                                    />
                                </FormControl>

                                <br></br><br></br>

                                <FormControl>
                                    <TextField
                                        select
                                        name="priority"
                                        id="priority"
                                        label="Priority"
                                        margin="dense"
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleChange("priority")}
                                        helperText="How urgent is this?"
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


                                </FormControl>
                                <br></br><br></br>
                                <FormControl>
                                    <Field name="duedate"
                                        label="Due date"
                                        inputVariant="outlined"
                                        helperText="When should it be done?"
                                        disablePast
                                        component={DateTimePicker}
                                        value={values.duedate}
                                        error={errors.duedate}
                                        touched={touched.duedate}
                                        onChange={date => setFieldValue("duedate", date.toISOString())} />
                                </FormControl>
                                <br></br><br></br>

                                {isSubmitting && <LinearProgress />}

                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting}
                                    onClick={submitForm}
                                >
                                    Save
          </Button>

                            </Container>

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