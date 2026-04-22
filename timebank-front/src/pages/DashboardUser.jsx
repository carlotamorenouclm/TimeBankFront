// Main user portal view: loads the profile summary, catalog, and purchase flow.
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavbarCustom from '../components/NavbarCustom';
import ServiceCard from '../components/ServiceCard';
import { getAvatarImage } from '../constants/avatarOptions';
import { getServiceImage, serviceImageOptions } from '../constants/serviceImages';
import {
  createServiceOffer,
  createServiceRequest,
  deleteServiceOffer,
  getDashboardServices,
  getPortalSummary,
} from '../services/portal/PortalService';

const initialRequestForm = {
  scheduledAt: '',
  street: '',
  streetNumber: '',
  floor: '',
  door: '',
  message: '',
};

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
  imageKey: 'computer',
};

const DashboardUser = () => {
  const [services, setServices] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [profile, setProfile] = useState({ name: '', role: 'USER' });
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedService, setSelectedService] = useState(null);
  const [requestForm, setRequestForm] = useState(initialRequestForm);
  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [purchaseResult, setPurchaseResult] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [summaryData, dashboardData] = await Promise.all([
        getPortalSummary(),
        getDashboardServices(),
      ]);

      setProfile(summaryData);
      setServices(dashboardData?.services || []);
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
      !serviceForm.price
    ) {
      setError('Please complete title, description, availability, and price.');
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
        image_key: serviceForm.imageKey,
      });

      setShowPublishModal(false);
      setServiceForm(initialServiceForm);
      setActiveTab('sell');
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

  const servicesToRender = activeTab === 'buy' ? services : myServices;
  const avatarImage = getAvatarImage(profile.avatar_key);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fc',
        fontFamily: "'Inter', sans-serif",
        color: '#2d3436',
      }}
    >
      <NavbarCustom />

      <Container fluid className="px-0">
        <Row className="g-0" style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Col
            xs={12}
            md={3}
            lg={2}
            style={{
              backgroundColor: '#dbe8f7',
              borderRight: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <div className="p-4 text-center border-bottom">
              <Link to="/profile" className="text-decoration-none text-reset d-block">
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

                <div className="fw-semibold">{profile.name || 'User'}</div>
                <div className="text-muted small">{profile.role || 'USER'}</div>
              </Link>
            </div>

            <Nav className="flex-column">
              <Nav.Link
                as={Link}
                to="/dashboarduser"
                className="px-4 py-3 fw-semibold"
                style={{
                  backgroundColor: '#6ea8fe',
                  color: 'white',
                }}
              >
                Catalog
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/history"
                className="px-4 py-3 fw-semibold text-dark"
              >
                History
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/inbox"
                className="px-4 py-3 fw-semibold text-dark"
              >
                Inbox
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/wallet"
                className="px-4 py-3 fw-semibold text-dark"
              >
                Wallet
              </Nav.Link>
            </Nav>
          </Col>

          <Col xs={12} md={9} lg={10} className="p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <h2 className="fw-bold mb-0">
                {activeTab === 'buy' ? 'Available Services' : 'My Published Services'}
              </h2>

              <div className="d-flex gap-2">
                <Button
                  variant={activeTab === 'buy' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveTab('buy')}
                >
                  Buy
                </Button>
                <Button
                  variant={activeTab === 'sell' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveTab('sell')}
                >
                  Sell
                </Button>
                <Button variant="success" onClick={openPublishModal}>
                  Publish service
                </Button>
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {isLoading && <p className="text-muted">Loading services...</p>}

            {!isLoading && !error && (
              <Row className="g-4">
                {servicesToRender.length > 0 ? (
                  servicesToRender.map((service) => (
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
                        actionLabel={activeTab === 'buy' ? 'Request' : 'Delete'}
                        actionDisabled={false}
                        onAction={() =>
                          activeTab === 'buy' ? openRequestModal(service) : openDeleteModal(service)
                        }
                      />
                    </Col>
                  ))
                ) : (
                  <Col xs={12}>
                    <div className="bg-white shadow-sm text-center p-5" style={{ borderRadius: '16px' }}>
                      <h5 className="fw-bold mb-2">
                        {activeTab === 'buy' ? 'No services available' : 'No published services'}
                      </h5>
                      <p className="text-muted mb-0">
                        {activeTab === 'buy'
                          ? 'Register another user or create more offers to test purchases.'
                          : 'This user does not own any service yet.'}
                      </p>
                    </div>
                  </Col>
                )}
              </Row>
            )}
          </Col>
        </Row>
      </Container>

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
                <Form.Select
                  name="imageKey"
                  value={serviceForm.imageKey}
                  onChange={handleServiceFormChange}
                >
                  {serviceImageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

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
    </div>
  );
};

export default DashboardUser;
