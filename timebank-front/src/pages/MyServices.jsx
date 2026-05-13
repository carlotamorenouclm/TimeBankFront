import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import ServiceCard from '../components/ServiceCard';
import { getServiceImage } from '../constants/serviceImages';
import { createServiceOffer, deleteServiceOffer, getDashboardServices, getServiceReviews } from '../services/portal/PortalService';
import RatingStars from '../components/RatingStars';

const initialServiceForm = {
  title: '',
  description: '',
  availability: '',
  homeService: true,
  street: '',
  streetNumber: '',
  floor: '',
  door: '',
  extra: '',
  price: '5',
  imageData: '',
  imageName: '',
};

const MAX_SERVICE_IMAGE_SIZE_MB = 8;
const MAX_SERVICE_IMAGE_SIZE = MAX_SERVICE_IMAGE_SIZE_MB * 1024 * 1024;

const MyServices = () => {
  const [myServices, setMyServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      setMyServices(dashboardData?.my_services || []);
    } catch (loadError) {
      setError(loadError.message || 'Error loading services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleServiceFormChange = (event) => {
    const { name, type, value, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setServiceForm((prev) => {
      const nextForm = { ...prev, [name]: nextValue };
      if (name === 'homeService' && checked) {
        nextForm.street = '';
        nextForm.streetNumber = '';
        nextForm.floor = '';
        nextForm.door = '';
      }
      return nextForm;
    });
  };

  const handleServiceImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setServiceForm((prev) => ({ ...prev, imageData: '', imageName: '' }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_SERVICE_IMAGE_SIZE) {
      setError(`Please choose an image smaller than ${MAX_SERVICE_IMAGE_SIZE_MB} MB.`);
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setServiceForm((prev) => ({
        ...prev,
        imageData: reader.result,
        imageName: file.name,
      }));
      setError('');
    };
    reader.onerror = () => {
      setError('The image could not be loaded. Please try another file.');
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const openPublishModal = () => {
    // Reset the form so every new service starts from a clean draft.
    setServiceForm(initialServiceForm);
    setError('');
    setShowPublishModal(true);
  };

  const openDeleteModal = (service) => {
    // Keep the selected owned service so the confirmation modal can delete it.
    setSelectedService(service);
    setError('');
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedService(null);
  };

  const handlePublishService = async () => {
    // Validate the minimum fields before sending the new service to the backend.
    if (
      !serviceForm.title ||
      !serviceForm.description ||
      !serviceForm.availability ||
      !serviceForm.price ||
      !serviceForm.imageData
    ) {
      setError('Please complete title, description, availability, price, and image.');
      return;
    }

    if (!serviceForm.homeService && (!serviceForm.street || !serviceForm.streetNumber)) {
      setError('Please complete the address when the service is not at home.');
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      await createServiceOffer({
        title: serviceForm.title,
        description: serviceForm.description,
        availability: serviceForm.availability,
        home_service: serviceForm.homeService,
        street: serviceForm.homeService ? null : serviceForm.street,
        street_number: serviceForm.homeService ? null : serviceForm.streetNumber,
        floor: serviceForm.homeService ? null : serviceForm.floor || null,
        door: serviceForm.homeService ? null : serviceForm.door || null,
        extra: serviceForm.extra || null,
        price: Number(serviceForm.price),
        image_key: serviceForm.imageData,
      });

      setShowPublishModal(false);
      setServiceForm(initialServiceForm);
      await loadDashboard();
    } catch (saveError) {
      setError(saveError.message || 'Error publishing service');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;

    try {
      setIsSaving(true);
      setError('');
      await deleteServiceOffer(selectedService.id);
      setShowDeleteModal(false);
      setSelectedService(null);
      await loadDashboard();
    } catch (saveError) {
      setError(saveError.message || 'Error deleting service');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <h2 className="fw-bold mb-0">My Published Services</h2>

        <div className="d-flex gap-2">
          <Button variant="success" onClick={openPublishModal}>
            Publish service
          </Button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {isLoading && <p className="text-muted">Loading services...</p>}

      {!isLoading && !error && (
        <Row className="g-4">
          {myServices.length > 0 ? (
            myServices.map((service) => (
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
                  actionLabel="Delete"
                  actionDisabled={false}
                  onAction={() => openDeleteModal(service)}
                  overallRating={service.overall_rating ?? null}
                  showSeeReviews={true}
                  onSeeReviews={() => openReviewsModal(service)}
                />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div className="bg-white shadow-sm text-center p-5" style={{ borderRadius: '16px' }}>
                <h5 className="fw-bold mb-2">No published services</h5>
                <p className="text-muted mb-0">This user does not own any service yet.</p>
              </div>
            </Col>
          )}
        </Row>
      )}

      <Modal show={showPublishModal} onHide={() => setShowPublishModal(false)} centered>
        <Modal.Body style={{ padding: '2rem', backgroundColor: '#dbe8f7' }}>
          <h4 className="fw-bold mb-4">Publish a new service</h4>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={serviceForm.title}
              onChange={handleServiceFormChange}
              placeholder="Computer setup"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={serviceForm.description}
              onChange={handleServiceFormChange}
              placeholder="I help you install software, printers, and home devices."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Availability</Form.Label>
            <Form.Control
              name="availability"
              value={serviceForm.availability}
              onChange={handleServiceFormChange}
              placeholder="Weekdays after 18:00"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Home service?</Form.Label>
            <div className="d-flex gap-4">
              <Form.Check
                inline
                type="radio"
                id="service-home-yes"
                label="Yes"
                name="homeService"
                checked={serviceForm.homeService}
                onChange={() =>
                  setServiceForm((prev) => ({
                    ...prev,
                    homeService: true,
                    street: '',
                    streetNumber: '',
                    floor: '',
                    door: '',
                  }))
                }
              />
              <Form.Check
                inline
                type="radio"
                id="service-home-no"
                label="No"
                name="homeService"
                checked={!serviceForm.homeService}
                onChange={() =>
                  setServiceForm((prev) => ({
                    ...prev,
                    homeService: false,
                  }))
                }
              />
            </div>
          </Form.Group>

          {!serviceForm.homeService && (
            <Row className="g-3 mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    name="street"
                    value={serviceForm.street}
                    onChange={handleServiceFormChange}
                    placeholder="Main Street"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Number</Form.Label>
                  <Form.Control
                    name="streetNumber"
                    value={serviceForm.streetNumber}
                    onChange={handleServiceFormChange}
                    placeholder="12"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Floor</Form.Label>
                  <Form.Control
                    name="floor"
                    value={serviceForm.floor}
                    onChange={handleServiceFormChange}
                    placeholder="2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Door</Form.Label>
                  <Form.Control
                    name="door"
                    value={serviceForm.door}
                    onChange={handleServiceFormChange}
                    placeholder="B"
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Extra details</Form.Label>
            <Form.Control
              name="extra"
              value={serviceForm.extra}
              onChange={handleServiceFormChange}
              placeholder="Home service or online support"
            />
          </Form.Group>

          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="1000"
                  name="price"
                  value={serviceForm.price}
                  onChange={handleServiceFormChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleServiceImageChange}
                />
                {serviceForm.imageName && (
                  <Form.Text className="text-muted">
                    {serviceForm.imageName}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          {serviceForm.imageData && (
            <div className="mb-4">
              <img
                src={serviceForm.imageData}
                alt="Service preview"
                className="w-100"
                style={{
                  maxHeight: '220px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
              />
            </div>
          )}

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => setShowPublishModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handlePublishService} disabled={isSaving}>
              {isSaving ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Body style={{ padding: '2rem', backgroundColor: '#f8f9fc' }}>
          <h4 className="fw-bold mb-3">Delete service</h4>
          <p className="mb-4">
            Are you sure you want to delete <strong>{selectedService?.title}</strong>?
          </p>
          <p className="text-muted small mb-4">
            Services with existing requests cannot be deleted.
          </p>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteService} disabled={isSaving}>
              {isSaving ? 'Deleting...' : 'Delete'}
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

export default MyServices;
