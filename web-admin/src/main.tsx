import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'

// Handle unhandled promise rejections from expected errors
window.addEventListener('unhandledrejection', (event) => {
  // Ignore expected "no rows found" errors from Supabase
  if (event.reason?.message?.includes('0 rows') || 
      event.reason?.code === 'PGRST116') {
    event.preventDefault();
  }
});

)
