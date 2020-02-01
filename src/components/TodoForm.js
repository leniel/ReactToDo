import React, {useEffect} from "react"
import * as Yup from 'yup';
import { Button, MenuItem, LinearProgress, TextField } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Grid from '@material-ui/core/Grid';
import { priority } from './constants'

export default function TodoForm(props)
{
    const fieldSize = 12

    let input = null

    // Setting focus when todo changes...
    useEffect(() =>
    {
        console.log('rendered!')
            
        if (input)
        {      
            //debugger;
                
            input.focus()
        }

    }, [props.todo])

    return (

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Formik
                validateOnMount={false} // Can validate the form up front with true
                validateOnChange={true}
                validateOnBlur={true}
                //initialValues={{ name: '', dueDate: null, priority: '' }}
                initialValues={props.todo} // empty todo (Add) or existing todo (Edit)
                enableReinitialize={true} // this enables filling the form with existing values

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

                onSubmit={(values, { setSubmitting, resetForm, initialValues}) =>
                {
                    props.onSubmit(values)

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
                                        autoFocus
                                        fullWidth
                                        name='name'
                                        label='Todo'
                                        variant="outlined"
                                        onChange={handleChange("name")}
                                        helperText={errors.name ? errors.name : "What should be done?"}
                                        error={errors.name}
                                        touched={touched.name}
                                        value={values.name}
                                        inputRef={(button) => { input = button }}
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
                                        autoOk
                                        format="MM/dd/yyyy HH:mm a"
                                        component={DateTimePicker}
                                        value={values.dueDate}
                                        error={errors.dueDate}
                                        touched={touched.dueDate}
                                        onChange={date => date && setFieldValue("dueDate", date.toISOString())} />
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

                                {isSubmitting && <LinearProgress />}
                                
                                <Grid item xl={fieldSize}
                                    md={fieldSize}
                                    sm={fieldSize}
                                    xs={fieldSize}
                                    align="center" justify="center">

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                        onClick={submitForm}
                                    >
                                        Save
          </Button>
                                </Grid>
                            </Grid>

                            {/* Useful during debugging - it shows all Formik props */}
                            {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}

                        </Form>                    
                    );
                }}

            </Formik>

        </MuiPickersUtilsProvider>
    )
}