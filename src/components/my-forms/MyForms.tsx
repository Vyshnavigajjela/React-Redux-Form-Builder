import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import { setCurrentForm } from '../../features/forms/formsSlice';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
} from '@mui/material';
import { FormSchema } from '../../features/forms/types';

const MyForms = () => {
  const forms = useSelector((state: RootState) => state.forms.forms);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFormClick = (form: FormSchema) => {
    dispatch(setCurrentForm(form));
    navigate('/preview');
  };

  if (forms.length === 0) {
    return <Typography sx={{ mt: 2 }}>No forms saved yet. Go to the "Create Form" page to build one.</Typography>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <List>
        {forms.map((form) => (
          <Paper key={form.id} sx={{ mb: 2 }}>
            <ListItem component="button" onClick={() => handleFormClick(form)}>
              <ListItemText
                primary={form.name}
                secondary={`Created on: ${new Date(form.createdAt).toLocaleDateString()}`}
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default MyForms;