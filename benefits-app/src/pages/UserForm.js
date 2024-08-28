import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const UserForm = () => {
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    householdSize: Yup.number().required('Required'),
    householdIncome: Yup.number().required('Required'),
  });

  return (
    <Formik
      initialValues={{ email: '', householdSize: '', householdIncome: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // Submit form values
      }}
    >
      <Form>
        <label htmlFor="email">Email</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" />

        <label htmlFor="householdSize">Household Size</label>
        <Field name="householdSize" type="number" />
        <ErrorMessage name="householdSize" />

        <label htmlFor="householdIncome">Household Income</label>
        <Field name="householdIncome" type="number" />
        <ErrorMessage name="householdIncome" />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default UserForm;