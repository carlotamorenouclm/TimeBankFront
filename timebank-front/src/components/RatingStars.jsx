/*
 * Componente reutilizable de interfaz para mantener las pantallas mas simples.
 *
 * Comentarios generados para documentar la intencion de cada bloque principal.
 */
// Clickable star rating control.
import React from 'react';

const RatingStars = ({
  value,
  onChange,
  max = 5,
  size = '1.6rem',
  activeColor = '#f4b400',
  inactiveColor = '#cbd5e1',
}) => {
  const numericValue = Number(value) || 0;

  return (
    <div className="d-flex align-items-center gap-1">
      {Array.from({ length: max }, (_, index) => {
        const ratingValue = index + 1;
        const isActive = numericValue >= ratingValue;

        return (
          <button
            key={ratingValue}
            type="button"
            className="btn btn-link p-0"
            aria-label={`Rate ${ratingValue} star${ratingValue === 1 ? '' : 's'}`}
            aria-pressed={isActive}
            onClick={() => onChange?.(String(ratingValue))}
            style={{
              fontSize: size,
              color: isActive ? activeColor : inactiveColor,
              textDecoration: 'none',
              lineHeight: 1,
            }}
          >
            {isActive ? '★' : '☆'}
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
