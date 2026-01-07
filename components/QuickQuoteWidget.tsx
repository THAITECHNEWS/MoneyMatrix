'use client';

import { useState } from 'react';
import Link from 'next/link';

interface QuickQuoteWidgetProps {
  loanType?: string;
  location?: string;
  position?: 'right' | 'bottom';
}

export default function QuickQuoteWidget({ 
  loanType = 'payday-loans',
  location,
  position = 'right'
}: QuickQuoteWidgetProps) {
  const [amount, setAmount] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Track event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'quick_quote_submit', {
        loan_type: loanType,
        location: location,
        amount: amount
      });
    }
    
    // Redirect to full form or lender comparison
    const params = new URLSearchParams({
      loanType,
      amount,
      zipCode,
      ...(location && { location })
    });
    
    window.location.href = `/loan-locator?${params.toString()}`;
  };

  if (position === 'bottom') {
    return (
      <div className="quick-quote-widget-bottom">
        <div className="container">
          <form onSubmit={handleSubmit} className="quick-quote-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quick-amount">Loan Amount</label>
                <select
                  id="quick-amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
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
                <label htmlFor="quick-zip">Zip Code</label>
                <input
                  type="text"
                  id="quick-zip"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="12345"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Get Quotes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`quick-quote-widget ${expanded ? 'expanded' : ''}`}>
      {!expanded ? (
        <button 
          className="quick-quote-trigger"
          onClick={() => setExpanded(true)}
          aria-label="Get Quick Quote"
        >
          <span className="quick-quote-icon">💰</span>
          <span className="quick-quote-text">Get Quotes</span>
        </button>
      ) : (
        <div className="quick-quote-content">
          <button 
            className="quick-quote-close"
            onClick={() => setExpanded(false)}
            aria-label="Close"
          >
            ×
          </button>
          <h3>Get Instant Quotes</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="widget-amount">Loan Amount</label>
              <select
                id="widget-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
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
              <label htmlFor="widget-zip">Zip Code</label>
              <input
                type="text"
                id="widget-zip"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="12345"
                pattern="[0-9]{5}"
                maxLength={5}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Get Quotes
            </button>
            <p className="quick-quote-disclaimer">
              By clicking, you agree to be contacted by lenders.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}








