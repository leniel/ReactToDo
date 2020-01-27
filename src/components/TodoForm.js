import React, { Component } from "react"
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Datepicker, Select, SubmitBtn } from 'react-formik-ui';

const TodoForm = () =>
{
    return (
        <Formik
            initialValues={{ name: '', dueDate: '', priority: '' }}
            validationSchema={Yup.object({
                name:
                    Yup.string()
                        .max(30, 'Must be 30 characters or less')
                        .required('Required'),
                dueDate:
                    Yup.date()
                        .required('Required'),
                priority:
                    Yup.number()
                        .required('Required')
            })}
            onSubmit={(values, { setSubmitting }) =>
            {
                values.dueDate = values.dueDate.toISOString()
                values.priority = parseInt(values.priority)

                //alert(JSON.stringify(values, null, 2));

                fetch(window.configs.webAPIUrl + "TodoItems", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                }).catch(error => console.error('Unable to add item.', error));

                setSubmitting(false)
            }}
        >

            <Form mode='themed'>

                <Input
                    name='name'
                    label='Todo'
                    hint=''
                />

                <Datepicker
                    name='dueDate'
                    label='Due date'
                    dateFormat='MM/dd/yyyy HH:mm'
                    placeholder=''
                    hint=''
                    minDate={new Date()}
                    timeIntervals="1"
                    showTimeSelect={true}
                />

                <Select
                    name='priority'
                    label='Priority'
                    placeholder='Select a priority'
                    options={[
                        { value: 0, label: 'Low' },
                        { value: 1, label: 'Normal' },
                        { value: 2, label: 'High' }
                    ]}
                />

                <SubmitBtn className="btn btn-primary">
                    Save
                </SubmitBtn>

            </Form>

        </Formik>
    );
};

export default TodoForm