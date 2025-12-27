import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Use the App shipped inside this Vite project
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
