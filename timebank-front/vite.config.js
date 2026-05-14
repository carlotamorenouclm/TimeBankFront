/*
 * Centraliza la configuracion de entorno que usa la aplicacion.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
