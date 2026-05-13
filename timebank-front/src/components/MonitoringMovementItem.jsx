// Single movement row for the monitoring list.
import React from 'react';
import { Badge, ListGroup } from 'react-bootstrap';
import getStatusBadge from '../utils/getStatusBadge';

const MonitoringMovementItem = ({ item }) => {

  return (
    <ListGroup.Item
      className="py-3 d-flex flex-column flex-md-row justify-content-between align-items-start gap-3"
    >
      <div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="fw-bold">{item.label}</span>
          {item.type !== 'Recharge' && getStatusBadge(item.status)}
          <Badge bg={item.type === 'Recharge' ? 'info' : 'secondary'}>
            {item.type}
          </Badge>
        </div>
        <div className="text-muted small mt-1">
          {item.date} · {item.detail} · User: {item.otherUser}
        </div>
      </div>
      <div
        className="fw-bold"
        style={{
          color: item.amount > 0 ? '#198754' : '#dc3545'
        }}
      >
        {item.amount > 0 ? '+' : ''}{item.amount} coins
      </div>
    </ListGroup.Item>
  );
};

export default MonitoringMovementItem;
