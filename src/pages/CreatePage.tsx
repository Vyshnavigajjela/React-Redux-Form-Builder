import React from 'react';
import Header from '../components/common/Header';
import FormBuilder from '../components/form-builder/FormBuilder';
import { Container, Typography } from '@mui/material';

const CreatePage = () => {
  return (
    <>
      <Header />
      <Container>
        <Typography variant="h4" gutterBottom>
          Form Builder
        </Typography>
        <FormBuilder />
      </Container>
    </>
  );
};

export default CreatePage;
