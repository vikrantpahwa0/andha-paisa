import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   // ← import
import { Provider } from 'react-redux'
import { store } from './store/store'
import App from './app'
import './index.css'

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>      {/* ← wrap App */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)