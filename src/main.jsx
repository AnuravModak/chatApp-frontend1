import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { WebSocketProvider } from './Components/WebSocketProvider.jsx'

createRoot(document.getElementById('root')).render(
  <WebSocketProvider>
    <App />
    </WebSocketProvider>
  
)
