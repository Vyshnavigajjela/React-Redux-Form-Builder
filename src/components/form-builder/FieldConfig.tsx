import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Divider,
  Switch,
} from '@mui/material';
import { Field } from '../../features/forms/types';

interface FieldConfigProps {
  field: Field;
  onUpdate: (field: Field) => void;
  onRemove: () => void;
  allFields: Field[];
}

const FieldConfig = ({ field, onUpdate, onRemove, allFields }: FieldConfigProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...field, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onUpdate({ ...field, [name]: checked });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    onUpdate({ ...field, [name]: value });
  };

  const handleParentFieldChange = (e: any) => {
    const parentFields = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
    onUpdate({ ...field, parentFields });
  };

  const handleOptionsChange = (optionsString: string) => {
    const options = optionsString
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    onUpdate({ ...field, options });
  };

  const handleDefaultValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let defaultValue: any = value;
    
    if (field.type === 'number') {
      defaultValue = value ? Number(value) : null;
    } else if (field.type === 'checkbox') {
      defaultValue = checked;
    }
    
    onUpdate({ ...field, defaultValue });
  };

  const isDerivedField = field.type === 'derived';
  const hasOptions = field.type === 'select' || field.type === 'radio';

  return (
    <Box sx={{ 
      border: '1px solid #e0e0e0', 
      p: 3, 
      mb: 2, 
      borderRadius: 2,
      backgroundColor: '#fafafa',
    }}>
      {/* Field Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">{field.label || 'New Field'}</Typography>
          <Chip 
            label={field.type} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
          {field.required && (
            <Chip 
              label="Required" 
              size="small" 
              color="error" 
              variant="outlined" 
            />
          )}
        </Box>
        <Button 
          variant="outlined" 
          color="error" 
          size="small"
          onClick={onRemove}
        >
          Remove
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Basic Field Configuration */}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {/* Field Label */}
        <TextField
          fullWidth
          label="Field Label"
          name="label"
          value={field.label || ''}
          onChange={handleInputChange}
          size="small"
        />

        {/* Field Type */}
        <FormControl fullWidth size="small">
          <InputLabel>Field Type</InputLabel>
          <Select
            name="type"
            value={field.type}
            onChange={handleSelectChange}
            label="Field Type"
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="textarea">Textarea</MenuItem>
            <MenuItem value="select">Select</MenuItem>
            <MenuItem value="radio">Radio</MenuItem>
            <MenuItem value="checkbox">Checkbox</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="derived">Derived</MenuItem>
          </Select>
        </FormControl>

        {/* Required Toggle */}
        {field.type !== 'checkbox' && (
          <FormControlLabel
            control={
              <Switch
                checked={field.required || false}
                onChange={handleCheckboxChange}
                name="required"
                size="small"
              />
            }
            label="Required Field"
          />
        )}

        {/* Default Value */}
        {!isDerivedField && (
          <>
            {field.type === 'checkbox' ? (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.defaultValue || false}
                    onChange={handleDefaultValueChange}
                    name="defaultValue"
                  />
                }
                label="Default Checked"
              />
            ) : (
              <TextField
                fullWidth
                label="Default Value"
                name="defaultValue"
                value={field.defaultValue || ''}
                onChange={handleDefaultValueChange}
                size="small"
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
              />
            )}
          </>
        )}

        {/* Options for Select and Radio */}
        {hasOptions && (
          <TextField
            fullWidth
            label="Options (comma-separated)"
            name="options"
            value={field.options?.join(', ') || ''}
            onChange={(e) => handleOptionsChange(e.target.value)}
            size="small"
            placeholder="Option 1, Option 2, Option 3"
            helperText="Separate each option with a comma"
          />
        )}

        {/* Derived Field Configuration */}
        {isDerivedField && (
          <Box sx={{ 
            border: '1px solid #e3f2fd', 
            borderRadius: 1, 
            p: 2, 
            backgroundColor: '#f3e5f5' 
          }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main' }}>
              Derived Field Configuration
            </Typography>
            
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Parent Fields</InputLabel>
              <Select
                multiple
                name="parentFields"
                value={field.parentFields || []}
                onChange={handleParentFieldChange}
                label="Parent Fields"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => {
                      const parentField = allFields.find(f => f.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={parentField?.label || value} 
                          size="small" 
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {allFields
                  .filter((f) => f.id !== field.id && f.type !== 'derived')
                  .map((f) => (
                    <MenuItem key={f.id} value={f.id}>
                      {f.label || 'Untitled'} ({f.type})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Computation Formula"
              name="computationFormula"
              value={field.computationFormula || ''}
              onChange={handleInputChange}
              size="small"
              placeholder="e.g., parent1 + parent2 * 0.1"
              helperText="Use parent field names or basic math operations"
              multiline
              rows={2}
            />
          </Box>
        )}

        {/* Placeholder for text-based fields */}
        {(field.type === 'text' || field.type === 'textarea' || field.type === 'number') && (
          <TextField
            fullWidth
            label="Placeholder Text"
            name="placeholder"
            value={field.placeholder || ''}
            onChange={handleInputChange}
            size="small"
            placeholder="Enter placeholder text..."
          />
        )}
      </Box>
    </Box>
  );
};

export default FieldConfig;