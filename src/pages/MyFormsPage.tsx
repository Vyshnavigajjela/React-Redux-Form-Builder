import React from 'react';
import Header from '../components/common/Header';
import MyForms from '../components/my-forms/MyForms';
import { Container, Typography } from '@mui/material';

const MyFormsPage = () => {
  return (
    <>
      <Header />
      <Container>
        <Typography variant="h4" gutterBottom>
          My Forms
        </Typography>
        <MyForms />
      </Container>
    </>
  );
};

export default MyFormsPage;
