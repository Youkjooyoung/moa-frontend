import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import './assets/global.css';
import './services/commonService.js';
import App from './App.jsx';
import { useAuthStore } from "@/store/authStore";

useAuthStore.getState().fetchSession();

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
      <Toaster position="top-right" richColors closeButton duration={4000} />
    </BrowserRouter>
);
