import React from 'react';
import { Link } from 'react-router-dom';

const SidebarUserCard = ({
  name,
  role,
  avatarImage,
  linkTo = '/profile',
  linkEnabled = true,
}) => {
  const content = (
    <>
      <div
        className="mx-auto mb-3 rounded-circle bg-white overflow-hidden"
        style={{
          width: '80px',
          height: '80px',
          border: '2px solid rgba(0,0,0,0.15)',
        }}
      >
        {avatarImage && (
          <img
            src={avatarImage}
            alt="User avatar"
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>

      <div className="fw-semibold">{name || 'User'}</div>
      <div className="text-muted small">{role || 'USER'}</div>
    </>
  );

  return (
    <div className="p-4 text-center border-bottom">
      {linkEnabled ? (
        <Link to={linkTo} className="text-decoration-none text-reset d-block">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
};

export default SidebarUserCard;
