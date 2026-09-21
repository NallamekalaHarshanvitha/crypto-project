import { useState } from "react";

const initialForm = {
  username: "",
  contactNumber: "",
  email: "",
  profile: "",
  address: "",
};

const stepTitles = [
  "Personal Details",
  "Profile & Address",
  "Review & Submit",
];

export default function Profile() {
  const [formData, setFormData] = useState(initialForm);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!formData.username.trim()) newErrors.username = "Username is required";
      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = "Contact number is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Enter a valid email";
      }
    }

    if (currentStep === 1) {
      if (!formData.profile.trim()) newErrors.profile = "Profile is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateStep()) return;
    setSubmitted(true);
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <>
          <div className="form-field">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="form-input"
            />
            {errors.username && <p className="field-error">{errors.username}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="contactNumber" className="form-label">
              Contact Number
            </label>
            <input
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter your contact number"
              className="form-input"
            />
            {errors.contactNumber && (
              <p className="field-error">{errors.contactNumber}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form-input"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
        </>
      );
    }

    if (currentStep === 1) {
      return (
        <>
          <div className="form-field">
            <label htmlFor="profile" className="form-label">
              Profile
            </label>
            <textarea
              id="profile"
              name="profile"
              value={formData.profile}
              onChange={handleChange}
              placeholder="Write a short profile"
              className="form-textarea"
            />
            {errors.profile && <p className="field-error">{errors.profile}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="form-textarea"
            />
            {errors.address && <p className="field-error">{errors.address}</p>}
          </div>
        </>
      );
    }

    return (
      <div className="summary-box">
        <div className="summary-row">
          <strong>Username</strong>
          <span>{formData.username}</span>
        </div>
        <div className="summary-row">
          <strong>Contact Number</strong>
          <span>{formData.contactNumber}</span>
        </div>
        <div className="summary-row">
          <strong>Email</strong>
          <span>{formData.email}</span>
        </div>
        <div className="summary-row">
          <strong>Profile</strong>
          <span>{formData.profile}</span>
        </div>
        <div className="summary-row">
          <strong>Address</strong>
          <span>{formData.address}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2 className="profile-title">Profile Registration</h2>

        <div className="stepper">
          {stepTitles.map((title, index) => (
            <div
              key={title}
              className={`form-step ${index === currentStep ? "active" : ""}`}
            >
              Step {index + 1}: {title}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {renderStepContent()}

          {!submitted && (
            <div className="form-actions">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`action-button secondary ${currentStep === 0 ? "disabled" : ""}`}
              >
                Previous
              </button>

              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="action-button primary"
                >
                  Next
                </button>
              ) : (
                <button type="submit" className="action-button primary">
                  Submit
                </button>
              )}
            </div>
          )}

          {submitted && (
            <div className="success-message">Form submitted successfully!</div>
          )}
        </form>
      </div>
    </div>
  );
}
