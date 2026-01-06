'use client';

import { useState } from 'react';
import { Store } from '@/lib/locations';

interface LeadCaptureFormProps {
  store?: Store;
  loanType: string;
  location?: string;
  onSuccess?: () => void;
}

export default function LeadCaptureForm({ 
  store, 
  loanType, 
  location,
  onSuccess 
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    loanAmount: '',
    purpose: '',
    preferredLocation: location || '',
    storeId: store?.id || '',
    loanType: loanType
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send to your API endpoint
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit lead');
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        loanAmount: '',
        purpose: '',
        preferredLocation: location || '',
        storeId: store?.id || '',
        loanType: loanType
      });

    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="lead-form-success">
        <h3>✅ Thank You!</h3>
        <p>We've received your request and will contact you shortly.</p>
        {store && (
          <div className="store-info">
            <p><strong>Location:</strong> {store.name}</p>
            <p><strong>Phone:</strong> <a href={`tel:${store.phone}`}>{store.phone}</a></p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="lead-capture-form">
      <h3>Get Your Quote</h3>
      {store && (
        <p className="form-location">Location: <strong>{store.name}</strong></p>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="loanAmount">Loan Amount *</label>
          <select
            id="loanAmount"
            required
            value={formData.loanAmount}
            onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
          >
            <option value="">Select Amount</option>
            <option value="100-500">$100 - $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-2500">$1,000 - $2,500</option>
            <option value="2500-5000">$2,500 - $5,000</option>
            <option value="5000+">$5,000+</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="purpose">Purpose</label>
          <select
            id="purpose"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          >
            <option value="">Select Purpose</option>
            <option value="emergency">Emergency Expenses</option>
            <option value="bills">Bills & Utilities</option>
            <option value="debt">Debt Consolidation</option>
            <option value="home">Home Improvement</option>
            <option value="vehicle">Vehicle Repair</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="form-error">{error}</div>
      )}

      <button 
        type="submit" 
        className="btn btn-primary btn-block"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Get My Quote'}
      </button>

      <p className="form-disclaimer">
        By submitting this form, you agree to be contacted by MoneyMatrix and its partners.
        We respect your privacy and will never share your information.
      </p>
    </form>
  );
}

