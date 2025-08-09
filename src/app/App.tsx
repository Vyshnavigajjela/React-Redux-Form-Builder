import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import CreatePage from '../pages/CreatePage';
import PreviewPage from '../pages/PreviewPage';
import MyFormsPage from '../pages/MyFormsPage';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/create" element={<CreatePage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/myforms" element={<MyFormsPage />} />
            <Route path="/" element={<CreatePage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
