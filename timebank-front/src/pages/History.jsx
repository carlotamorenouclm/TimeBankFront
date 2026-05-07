// User history view with filters for purchases, sales, or the full timeline.
import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import TransactionCard from '../components/TransactionCard';
import { getHistory } from '../services/portal/PortalService';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        setError('');

        const historyData = await getHistory();
        setTransactions(historyData?.transactions || []);
      } catch (loadError) {
        setError(loadError.message || 'Error loading history');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'purchases') return transaction.type === 'Purchase';
    if (filter === 'sales') return transaction.type === 'Sale';
    return true;
  });
  return (
    <>
      <div className="mb-4">
        <div className="d-flex gap-3">
          <Button
            variant={filter === 'purchases' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('purchases')}
          >
            Purchases
          </Button>

          <Button
            variant={filter === 'sales' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('sales')}
          >
            Sales
          </Button>

          <Button
            variant={filter === 'all' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
        </div>
      </div>

      {isLoading && <p className="text-muted">Loading history...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!isLoading && !error && (
        <Row className="g-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <Col xs={12} md={6} lg={4} key={transaction.id}>
                <TransactionCard transaction={transaction} />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div
                className="bg-white shadow-sm text-center p-5"
                style={{ borderRadius: '16px' }}
              >
                <h5 className="fw-bold mb-2">No transactions found</h5>
                <p className="text-muted mb-0">
                  No transactions match the selected filter.
                </p>
              </div>
            </Col>
          )}
        </Row>
      )}
    </>
  );
};

export default History;
