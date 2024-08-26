import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const UserFormSchema = Yup.object().shape({
  familySize: Yup.number().required('Required'),
  income: Yup.number().required('Required'),
  age: Yup.number().required('Required'),
  pregnant: Yup.boolean().required('Required'),
  dependantUnder18: Yup.boolean().required('Required'),
  disability: Yup.boolean().required('Required'),
  unemployed: Yup.boolean().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

const UserForm = () => {
  return (
    <Formik
      initialValues={{
        familySize: '',
        income: '',
        age: '',
        pregnant: false,
        dependantUnder18: false,
        disability: false,
        unemployed: false,
        email: '',
      }}
      validationSchema={UserFormSchema}
      onSubmit={(values) => {
        axios.post('/api/user-data', values)
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Field name="familySize" as={TextField} label="Family Size" error={touched.familySize && !!errors.familySize} helperText={touched.familySize && errors.familySize} />
          <Field name="income" as={TextField} label="Income" error={touched.income && !!errors.income} helperText={touched.income && errors.income} />
          <Field name="age" as={TextField} label="Age" error={touched.age && !!errors.age} helperText={touched.age && errors.age} />
          <Field name="pregnant" type="checkbox" as={TextField} label="Pregnant" />
          <Field name="dependantUnder18" type="checkbox" as={TextField} label="Dependant Under 18" />
          <Field name="disability" type="checkbox" as={TextField} label="Disability" />
          <Field name="unemployed" type="checkbox" as={TextField} label="Unemployed" />
          <Field name="email" as={TextField} label="Email" error={touched.email && !!errors.email} helperText={touched.email && errors.email} />
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;