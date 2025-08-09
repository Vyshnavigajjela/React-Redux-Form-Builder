// Validation rule types as specified in the assignment
export interface ValidationRule {
  id: string;
  type: 'notEmpty' | 'minLength' | 'maxLength' | 'email' | 'password' | 'custom';
  value?: number | string;
  message: string;
  enabled: boolean;
}

// Password validation specific configuration
export interface PasswordValidation {
  minLength: number;
  requireNumber: boolean;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireSpecialChar?: boolean;
}

export interface Field {
  id: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'derived';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // For select and radio fields
  validationRules: ValidationRule[]; // Changed from string to array of validation rules
  
  // For derived fields
  parentFields?: string[]; // IDs of parent fields
  computationFormula?: string; // Formula for computation
  
  // Additional properties for better UX
  placeholder?: string;
  helpText?: string;
  order: number; // For field ordering
}

export interface FormSchema {
  id: string;
  name: string;
  description?: string; // Optional form description
  createdAt: string;
  updatedAt?: string; // Track when form was last modified
  fields: Field[];
}

export interface FormsState {
  forms: FormSchema[];
  currentForm: FormSchema | null;
  isLoading: boolean;
  error: string | null;
}

// Action types for Redux
export interface FormAction {
  type: string;
  payload?: any;
}

// Form builder specific types
export interface FieldConfiguration {
  field: Field;
  isEditing: boolean;
}

// Preview form data
export interface FormData {
  [fieldId: string]: any;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Field type configurations for the form builder
export interface FieldTypeConfig {
  type: Field['type'];
  label: string;
  icon: string;
  defaultConfig: Partial<Field>;
  supportedValidations: ValidationRule['type'][];
}

// Available field types configuration
export const FIELD_TYPES: FieldTypeConfig[] = [
  {
    type: 'text',
    label: 'Text',
    icon: 'text_fields',
    defaultConfig: {
      placeholder: 'Enter text...',
      validationRules: []
    },
    supportedValidations: ['notEmpty', 'minLength', 'maxLength', 'email']
  },
  {
    type: 'number',
    label: 'Number',
    icon: 'numbers',
    defaultConfig: {
      placeholder: 'Enter number...',
      validationRules: []
    },
    supportedValidations: ['notEmpty', 'minLength', 'maxLength']
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: 'text_snippet',
    defaultConfig: {
      placeholder: 'Enter text...',
      validationRules: []
    },
    supportedValidations: ['notEmpty', 'minLength', 'maxLength']
  },
  {
    type: 'select',
    label: 'Select',
    icon: 'arrow_drop_down',
    defaultConfig: {
      options: ['Option 1', 'Option 2'],
      validationRules: []
    },
    supportedValidations: ['notEmpty']
  },
  {
    type: 'radio',
    label: 'Radio',
    icon: 'radio_button_checked',
    defaultConfig: {
      options: ['Option 1', 'Option 2'],
      validationRules: []
    },
    supportedValidations: ['notEmpty']
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'check_box',
    defaultConfig: {
      defaultValue: false,
      validationRules: []
    },
    supportedValidations: ['notEmpty']
  },
  {
    type: 'date',
    label: 'Date',
    icon: 'calendar_today',
    defaultConfig: {
      validationRules: []
    },
    supportedValidations: ['notEmpty']
  },
  {
    type: 'derived',
    label: 'Derived Field',
    icon: 'calculate',
    defaultConfig: {
      parentFields: [],
      computationFormula: '',
      validationRules: []
    },
    supportedValidations: []
  }
];

// Utility type for form validation
export type FieldValidationFunction = (value: any, field: Field) => string | null;

// LocalStorage keys
export const STORAGE_KEYS = {
  FORMS: 'form_builder_forms',
  CURRENT_FORM: 'form_builder_current_form'
} as const;