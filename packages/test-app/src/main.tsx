import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'normalize.css';
import './index.css'
import App from './App.tsx'
import { apiMockConfig } from './api/apiMock.ts';

//■APIMockの初期化
if(apiMockConfig.isApiMockEnabled){
  
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
