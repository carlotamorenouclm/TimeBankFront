/*
 * Monta la aplicacion React en el DOM e inicializa estilos globales.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Punto de entrada de React: monta la aplicacion, el router y los estilos globales.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
