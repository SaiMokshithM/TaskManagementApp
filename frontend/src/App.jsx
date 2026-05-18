import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            },
            success: { style: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' } },
            error:   { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
