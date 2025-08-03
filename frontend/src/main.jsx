import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PollContextProvider from './context/pollContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <PollContextProvider>
      <App />
    </PollContextProvider>
  </BrowserRouter>
)
