'use client';

import { useState } from 'react';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorType: 'loan' | 'mortgage';
  totalPayments?: number;
}

export default function EmailCaptureModal({ isOpen, onClose, calculatorType, totalPayments }: EmailCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call - replace with actual implementation later
    setTimeout(() => {
      setIsSubmitting(false);
      // In real implementation, this would send email and generate PDF
      alert('Thank you! Your full report will be sent to your email shortly.');
      setEmail('');
      onClose();
    }, 1000);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="email-modal-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="email-modal-container">
        <div className="email-modal-content">
          {/* Close Button */}
          <button 
            className="email-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>

          {/* Header */}
          <div className="email-modal-header">
            <div className="email-modal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="email-modal-title">
              Download Your Full {calculatorType === 'mortgage' ? 'Mortgage' : 'Loan'} Report
            </h2>
            <p className="email-modal-description">
              Get a complete PDF report with your full payment schedule, amortization table, and detailed breakdown sent directly to your email.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="email-modal-form">
            <div className="email-modal-input-group">
              <label htmlFor="email" className="email-modal-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="email-modal-input"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="email-modal-benefits">
              <p className="email-modal-benefits-title">Your report will include:</p>
              <ul className="email-modal-benefits-list">
                <li>Complete payment schedule for all {totalPayments ? totalPayments.toLocaleString() : (calculatorType === 'mortgage' ? '360' : 'loan')} payments</li>
                <li>Detailed amortization breakdown</li>
                <li>Total interest and principal analysis</li>
                <li>Year-by-year payment summary</li>
                <li>Printable PDF format</li>
              </ul>
            </div>

            <div className="email-modal-actions">
              <button
                type="button"
                className="email-modal-cancel"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="email-modal-submit"
                disabled={isSubmitting || !email}
              >
                {isSubmitting ? 'Sending...' : 'Get My Full Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

