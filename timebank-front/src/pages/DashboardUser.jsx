// Main user portal view: loads the profile summary, catalog, and purchase flow.
import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import ServiceCard from '../components/ServiceCard';
import { getServiceImage } from '../constants/serviceImages';
import {createServiceRequest, getDashboardServices, getServiceReviews,} from '../services/portal/PortalService';
import RatingStars from '../components/RatingStars';

const initialRequestForm = {
  scheduledAt: '',
  street: '',
  streetNumber: '',
  floor: '',
  door: '',
  message: '',
};

const DashboardUser = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [requestForm, setRequestForm] = useState(initialRequestForm);
  const [purchaseResult, setPurchaseResult] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
// Reviews modal state
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [reviewsService, setReviewsService] = useState(null);
  const [serviceReviews, setServiceReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');

  // Handler to open reviews modal for a service
  const openReviewsModal = async (service) => {
    setReviewsService(service);
    setServiceReviews([]);
    setReviewsError('');
    setShowReviewsModal(true);
    try {
      setIsReviewsLoading(true);
      const response = await getServiceReviews(service.id);
      const reviews = Array.isArray(response) ? response : response?.reviews || [];
      setServiceReviews(reviews);
    } catch (err) {
      setReviewsError(err.message || 'Error loading reviews');
    } finally {
      setIsReviewsLoading(false);
    }
  };

  const closeReviewsModal = () => {
    setShowReviewsModal(false);
    setReviewsService(null);
    setServiceReviews([]);
    setReviewsError('');
  };
  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError('');

      const dashboardData = await getDashboardServices();
      setServices(dashboardData?.services || []);
    } catch (loadError) {
      setError(loadError.message || 'Error loading services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const openRequestModal = (service) => {
    // Store the selected service so both follow-up modals can reuse it.
    setSelectedService(service);
    setRequestForm(initialRequestForm);
    setShowRequestModal(true);
  };

  const handleRequestFormChange = (event) => {
    const { name, value } = event.target;
    setRequestForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinueToPayment = () => {
    // Keep the payment modal closed until the required fields are filled in.
    if (!requestForm.scheduledAt) {
      setError('Please fill the date before continuing.');
      return;
    }

    if (
      selectedService?.home_service &&
      (!requestForm.street || !requestForm.streetNumber)
    ) {
      setError('Please fill date, street and number before continuing.');
      return;
    }

    setError('');
    setShowRequestModal(false);
    setShowPaymentModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedService) return;

    try {
      setIsSaving(true);
      setError('');

      const response = await createServiceRequest(selectedService.id, {
        scheduled_at: requestForm.scheduledAt,
        street: selectedService.home_service ? requestForm.street : selectedService.address,
        street_number: selectedService.home_service ? requestForm.streetNumber : '-',
        floor: selectedService.home_service ? requestForm.floor || null : null,
        door: selectedService.home_service ? requestForm.door || null : null,
        message: requestForm.message || null,
      });

      setPurchaseResult(response);
      setShowPaymentModal(false);
      setShowSuccessModal(true);
      await loadDashboard();
    } catch (saveError) {
      setError(saveError.message || 'Error creating request');
      setShowPaymentModal(false);
      setShowRequestModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setSelectedService(null);
    setRequestForm(initialRequestForm);
    setPurchaseResult(null);
  };

  

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <h2 className="fw-bold mb-0">Available Services</h2>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {isLoading && <p className="text-muted">Loading services...</p>}

      {!isLoading && !error && (
        <Row className="g-4">
          {services.length > 0 ? (
            services.map((service) => (
              <Col xs={12} key={service.id}>
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  availability={service.availability}
                  location={
                    service.home_service
                      ? 'Home service'
                      : service.address
                        ? `Address: ${service.address}`
                        : 'Address pending'
                  }
                  extra={[service.extra, `Provider: ${service.owner_name}`]
                    .filter(Boolean)
                    .join(' · ')}
                  price={`${service.price} coins`}
                  image={getServiceImage(service.image_key)}
                  actionLabel="Request"
                  actionDisabled={false}
                  onAction={() => openRequestModal(service)}
                  overallRating={service.overall_rating ?? null}
                  showSeeReviews={true}
                  onSeeReviews={() => openReviewsModal(service)}
                />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div className="bg-white shadow-sm text-center p-5" style={{ borderRadius: '16px' }}>
                <h5 className="fw-bold mb-2">
                  No services available
                </h5>
                <p className="text-muted mb-0">
                  Register another user or create more offers to test purchases.
                </p>
              </div>
            </Col>
          )}
        </Row>
      )}

      <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)} centered>
        <Modal.Body style={{ padding: '2rem', backgroundColor: '#dbe8f7' }}>
          <h4 className="fw-bold mb-4">Request: {selectedService?.title}</h4>

          <Form.Group className="mb-3">
            <Form.Label>Date and time</Form.Label>
            <Form.Control
              name="scheduledAt"
              value={requestForm.scheduledAt}
              onChange={handleRequestFormChange}
              placeholder="Tuesday 14 at 16:00"
            />
          </Form.Group>

          {selectedService?.home_service ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Street</Form.Label>
                <Form.Control
                  name="street"
                  value={requestForm.street}
                  onChange={handleRequestFormChange}
                  placeholder="Main Street"
                />
              </Form.Group>

              <Row className="g-3 mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>No.</Form.Label>
                    <Form.Control
                      name="streetNumber"
                      value={requestForm.streetNumber}
                      onChange={handleRequestFormChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Floor</Form.Label>
                    <Form.Control
                      name="floor"
                      value={requestForm.floor}
                      onChange={handleRequestFormChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Door</Form.Label>
                    <Form.Control
                      name="door"
                      value={requestForm.door}
                      onChange={handleRequestFormChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Service address</Form.Label>
              <Form.Control
                value={selectedService?.address || 'Address not available'}
                readOnly
              />
            </Form.Group>
          )}

          <Form.Group className="mb-4">
            <Form.Label>Additional message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="message"
              value={requestForm.message}
              onChange={handleRequestFormChange}
              placeholder="The doorbell is not working"
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="fw-bold fs-4">Payment: {selectedService?.price} coins</div>
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleContinueToPayment}>
                Continue
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Body style={{ padding: '2rem', backgroundColor: '#dbe8f7' }}>
          <h2 className="fw-bold mb-4">You are about to complete the payment</h2>
          <p>The money will be deducted from your account automatically.</p>
          <p>If the provider rejects the request, the money will be refunded.</p>
          <p className="mb-4">Do you want to continue?</p>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmPurchase} disabled={isSaving}>
              {isSaving ? 'Processing...' : 'Continue'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showSuccessModal} onHide={closeSuccessModal} centered>
        <Modal.Body style={{ padding: '2rem', backgroundColor: '#dbe8f7' }}>
          <h2 className="fw-bold mb-4">Purchase completed</h2>
          <p>You will receive the provider response in the next few days.</p>
          <p className="mb-4">
            New available balance: <strong>{purchaseResult?.new_balance ?? '-'}</strong> coins
          </p>

          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={closeSuccessModal}>
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Reviews Modal */}
      <Modal show={showReviewsModal} onHide={closeReviewsModal} centered>
        <Modal.Body style={{ padding: '2rem' }}>
          <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
            <div>
              <h4 className="fw-bold mb-1">Reviews</h4>
              <p className="text-muted mb-0">
                {reviewsService?.title ? `Service: ${reviewsService.title}` : ''}
              </p>
            </div>
            <Button
              variant="outline-danger"
              onClick={closeReviewsModal}
              aria-label="Close reviews"
              className="fw-bold"
            >
              X
            </Button>
          </div>

          {isReviewsLoading ? (
            <div className="text-center text-muted">Loading reviews...</div>
          ) : serviceReviews.length === 0 ? (
            <div className="text-center text-muted">No reviews yet.</div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {serviceReviews.map((review, index) => {
                const reviewerName =
                  review.reviewer_name ||
                  review.reviewerName ||
                  review.reviewer ||
                  review.author_name ||
                  'User';
                const ratingValue = review.rating ?? review.score ?? 0;
                const commentValue = review.comment || 'No comment provided.';
                const createdAt = review.created_at || review.createdAt || '';
                return (
                  <div
                    key={review.id || `${reviewerName}-${index}`}
                    className="border rounded-3 p-3 bg-white"
                  >
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <div className="fw-semibold">{reviewerName}</div>
                      {createdAt && (
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                          {createdAt}
                        </div>
                      )}
                    </div>
                    <div className="mb-2">
                      <RatingStars value={String(ratingValue)} />
                    </div>
                    <div className="text-muted">{commentValue}</div>
                  </div>
                );
              })}
            </div>
          )}

          {reviewsError && <div className="alert alert-danger mt-3">{reviewsError}</div>}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DashboardUser;
