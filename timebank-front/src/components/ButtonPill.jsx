/*
 * Componente reutilizable de interfaz para mantener las pantallas mas simples.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Boton reutilizable con estilo redondeado usado por toda la interfaz.
import React from 'react';
import { Button } from 'react-bootstrap';

const ButtonPill = ({ children, className = '', bg = 'var(--blue)', border = 'transparent', font = 'white', ...props 
}) => {
  return (
    <Button 
      className={`rounded-pill ${className}`}
      style={{ 
        backgroundColor: bg,
        borderColor: border,
        color: font,
        border: border !== 'transparent' ? '2px solid' : 'none'
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ButtonPill;
