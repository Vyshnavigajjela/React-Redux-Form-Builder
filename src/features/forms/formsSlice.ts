import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormsState, FormSchema, Field } from './types';

const initialState: FormsState = {
  forms: JSON.parse(localStorage.getItem('forms') || '[]'),
  currentForm: null,
  isLoading: false,
  error: null,
};

export const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addForm: (state, action: PayloadAction<FormSchema>) => {
      state.forms.push(action.payload);
      localStorage.setItem('forms', JSON.stringify(state.forms));
    },
    setCurrentForm: (state, action: PayloadAction<FormSchema | null>) => {
      state.currentForm = action.payload;
    },
    updateCurrentForm: (state, action: PayloadAction<FormSchema>) => {
      state.currentForm = action.payload;
    },
    addField: (state, action: PayloadAction<Field>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
      }
    },
    updateField: (state, action: PayloadAction<Field>) => {
      if (state.currentForm) {
        const index = state.currentForm.fields.findIndex(
          (field) => field.id === action.payload.id
        );
        if (index !== -1) {
          state.currentForm.fields[index] = action.payload;
        }
      }
    },
    removeField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(
          (field) => field.id !== action.payload
        );
      }
    },
    saveForm: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        const formToSave = {
          ...state.currentForm,
          id: Date.now().toString(),
          name: action.payload,
          createdAt: new Date().toISOString(),
        };
        state.forms.push(formToSave);
        localStorage.setItem('forms', JSON.stringify(state.forms));
        state.currentForm = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addForm,
  setCurrentForm,
  updateCurrentForm,
  addField,
  updateField,
  removeField,
  saveForm,
  setLoading,
  setError,
} = formsSlice.actions;

export default formsSlice.reducer;