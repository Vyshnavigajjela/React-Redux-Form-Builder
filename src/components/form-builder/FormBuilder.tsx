import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Box,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  setCurrentForm,
  addField,
  updateField,
  removeField,
  saveForm,
} from '../../features/forms/formsSlice';
import { RootState } from '../../app/store';
import FieldConfig from './FieldConfig';
import { Field } from '../../features/forms/types';

// Define FIELD_TYPES locally
const FIELD_TYPES = [
  { type: 'text' as const, label: 'Text' },
  { type: 'number' as const, label: 'Number' },
  { type: 'textarea' as const, label: 'Textarea' },
  { type: 'select' as const, label: 'Select' },
  { type: 'radio' as const, label: 'Radio' },
  { type: 'checkbox' as const, label: 'Checkbox' },
  { type: 'date' as const, label: 'Date' },
  { type: 'derived' as const, label: 'Derived Field' },
];

const FormBuilder = () => {
  const dispatch = useDispatch();
  const currentForm = useSelector((state: RootState) => state.forms.currentForm);
  const [formName, setFormName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (!currentForm) {
      dispatch(setCurrentForm({
        id: Date.now().toString(),
        name: '',
        createdAt: '',
        fields: [],
      }));
    }
  }, [currentForm, dispatch]);

  const handleAddField = (type: Field['type']) => {
    if (currentForm) {
      const newField: Field = {
        id: Date.now().toString(),
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
        type,
        required: false,
        defaultValue: type === 'checkbox' ? false : '',
        validationRules: [],
        order: currentForm.fields.length,
      };
      
      // Add default options for select and radio
      if (type === 'select' || type === 'radio') {
        newField.options = ['Option 1', 'Option 2'];
      }
      
      // Add default config for derived fields
      if (type === 'derived') {
        newField.parentFields = [];
        newField.computationFormula = '';
      }
      
      dispatch(addField(newField));
    }
  };

  const handleUpdateField = (updatedField: Field) => {
    dispatch(updateField(updatedField));
  };

  const handleRemoveField = (fieldId: string) => {
    dispatch(removeField(fieldId));
  };

  const handleSaveForm = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormName('');
  };

  const handleConfirmSave = () => {
    if (formName.trim()) {
      dispatch(saveForm(formName.trim()));
      setOpenDialog(false);
      setFormName('');
    }
  };

  if (!currentForm) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ mt: 4, p: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Form Builder
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Create dynamic forms by adding and configuring fields below.
      </Typography>

      {/* Field Type Buttons */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add Field Types
        </Typography>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 2
          }}
        >
          {FIELD_TYPES.map((fieldType) => (
            <Tooltip key={fieldType.type} title={`Add ${fieldType.label} Field`}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleAddField(fieldType.type)}
                sx={{ 
                  height: 60,
                  textTransform: 'none',
                  justifyContent: 'center',
                }}
              >
                {fieldType.label}
              </Button>
            </Tooltip>
          ))}
        </Box>
      </Paper>

      {/* Form Fields Configuration */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Form Fields
        </Typography>
        
        {currentForm.fields.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 6,
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            bgcolor: 'grey.50'
          }}>
            <Typography variant="h6" color="textSecondary">
              No fields added yet
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Click on the buttons above to start adding fields to your form
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            {currentForm.fields
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((field) => (
                <FieldConfig
                  key={field.id}
                  field={field}
                  onUpdate={handleUpdateField}
                  onRemove={() => handleRemoveField(field.id)}
                  allFields={currentForm.fields}
                />
              ))}
          </Box>
        )}
      </Paper>

      {/* Save Form Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {currentForm.fields.length} field{currentForm.fields.length !== 1 ? 's' : ''} added
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSaveForm}
          disabled={currentForm.fields.length === 0}
        >
          Save Form
        </Button>
      </Box>

      {/* Save Form Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a name for your form.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name *"
            fullWidth
            variant="outlined"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            error={formName.length > 0 && formName.trim().length === 0}
            helperText={formName.length > 0 && formName.trim().length === 0 ? "Form name is required" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button 
            onClick={handleConfirmSave} 
            disabled={!formName.trim()}
            variant="contained"
          >
            Save Form
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormBuilder;