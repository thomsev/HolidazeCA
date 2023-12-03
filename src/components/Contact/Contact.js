import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Container, Row, Col, Alert } from 'react-bootstrap';
import './Contact.css';

const contactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  message: Yup.string()
    .min(10, 'Message too short!')
    .required('Required'),
});

const Contact = () => {
  const [showThankYou, setShowThankYou] = useState(false);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Contact Us</h2>
          {showThankYou && (
            <Alert variant="success">
              Thank you for contacting us! We will get back to you as soon as possible.
            </Alert>
          )}
          <Formik
            initialValues={{ name: '', email: '', message: '' }}
            validationSchema={contactSchema}
            onSubmit={(values, actions) => {
              console.log(values);
              setShowThankYou(true);
              // Simulate an API call
              setTimeout(() => {
                setShowThankYou(false);
              }, 5000); // Hide the message after 5 seconds
              actions.setSubmitting(false);
              actions.resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <Field name="name" type="text" className="form-control" />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <Field name="message" as="textarea" rows="5" className="form-control" />
                  <ErrorMessage name="message" component="div" className="text-danger" />
                </div>

                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
