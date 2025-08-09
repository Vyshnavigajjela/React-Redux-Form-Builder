import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import FormPreview from '../components/preview/FormPreview';
import { Container, Typography, Button } from '@mui/material';

const PreviewPage = () => {
  const currentForm = useSelector((state: RootState) => state.forms.currentForm);
  const navigate = useNavigate();

  if (!currentForm) {
    return (
      <>
        <Header />
        <Container>
          <Typography variant="h5">No form selected for preview.</Typography>
          <Button variant="contained" onClick={() => navigate('/myforms')}>
            Go to My Forms
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <Typography variant="h4" gutterBottom>
          Preview: {currentForm.name || 'Unnamed Form'}
        </Typography>
        <FormPreview formSchema={currentForm} />
      </Container>
    </>
  );
};

export default PreviewPage;
