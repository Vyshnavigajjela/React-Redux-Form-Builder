import React, { useState, useEffect } from 'react';
import { FormSchema, Field } from '../../features/forms/types';
import {
  Box,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  Checkbox,
  InputLabel,
  Typography,
  SelectChangeEvent,
} from '@mui/material';

interface FormPreviewProps {
  formSchema: FormSchema;
}

const FormPreview = ({ formSchema }: FormPreviewProps) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialValues = formSchema.fields.reduce((acc: Record<string, any>, field) => {
      acc[field.id] = field.defaultValue || '';
      return acc;
    }, {});
    setFormValues(initialValues);
    setErrors({});
  }, [formSchema]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name as string]: value
    }));
    
    // Clear error when user selects
    if (errors[name as string]) {
      setErrors(prev => ({
        ...prev,
        [name as string]: ''
      }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getDerivedValue = (field: Field, allValues: Record<string, any>) => {
    if (!field.computationFormula || !field.parentFields) return '';

    try {
      let formula = field.computationFormula;
      
      // Replace field labels in the formula with their corresponding values
      field.parentFields.forEach(parentFieldId => {
        const parentField = formSchema.fields.find(f => f.id === parentFieldId);
        if (parentField) {
          const value = allValues[parentFieldId] || 0;
          // Replace field label or ID in formula with actual value
          formula = formula.replace(
            new RegExp(`\\b${parentField.label}\\b`, 'gi'), 
            String(value)
          );
          formula = formula.replace(
            new RegExp(`\\b${parentFieldId}\\b`, 'gi'), 
            String(value)
          );
        }
      });

      // Use Function constructor instead of eval for better security
      const result = new Function('return ' + formula)();
      return isNaN(result) ? 'Invalid calculation' : result;
    } catch (error) {
      return 'Error in formula';
    }
  };

  const renderField = (field: Field) => {
    const error = errors[field.id];
    const value = formValues[field.id] || '';

    if (field.type === 'derived') {
      const derivedValue = getDerivedValue(field, formValues);
      return (
        <TextField
          key={field.id}
          name={field.id}
          label={`${field.label} (Derived)`}
          value={derivedValue}
          disabled
          fullWidth
          margin="normal"
          variant="outlined"
        />
      );
    }

    const commonProps = {
      key: field.id,
      name: field.id,
      required: field.required,
      error: !!error,
      fullWidth: true,
      margin: 'normal' as const,
    };

    switch (field.type) {
      case 'text':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            value={value}
            onChange={handleInputChange}
            helperText={error}
          />
        );
        
      case 'number':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            type="number"
            value={value}
            onChange={handleInputChange}
            helperText={error}
          />
        );
        
      case 'textarea':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            multiline
            rows={4}
            value={value}
            onChange={handleInputChange}
            helperText={error}
          />
        );
        
      case 'select':
        return (
          <FormControl {...commonProps} error={!!error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              name={field.id}
              label={field.label}
              value={value}
              onChange={handleSelectChange}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );
        
      case 'radio':
        return (
          <FormControl key={field.id} component="fieldset" margin="normal" error={!!error}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              name={field.id}
              value={value}
              onChange={handleRadioChange}
              row
            >
              {field.options?.map((option) => (
                <FormControlLabel 
                  key={option} 
                  value={option} 
                  control={<Radio />} 
                  label={option} 
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );
        
      case 'checkbox':
        return (
          <FormControlLabel
            key={field.id}
            control={
              <Checkbox 
                checked={!!value} 
                onChange={handleInputChange} 
                name={field.id} 
              />
            }
            label={field.label}
          />
        );
        
      case 'date':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            type="date"
            value={value}
            onChange={handleInputChange}
            helperText={error}
            InputLabelProps={{ shrink: true }}
          />
        );
        
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    formSchema.fields.forEach((field) => {
      if (field.required && field.type !== 'derived') {
        const value = formValues[field.id];
        if (!value && value !== 0) {
          newErrors[field.id] = `${field.label} is required`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Form Submitted! Check console for values.');
      console.log('Form Values:', formValues);
    } else {
      alert('Please fill out all required fields.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {formSchema.fields.map(renderField)}
      <Button type="submit" variant="contained" sx={{ mt: 3 }}>
        Submit
      </Button>
    </Box>
  );
};

export default FormPreview;