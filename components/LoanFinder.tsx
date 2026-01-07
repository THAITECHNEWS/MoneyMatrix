'use client';

import { useState } from 'react';

interface LoanOffer {
  lender: string;
  logo?: string;
  rating: number;
  aprFrom: string;
  aprNote?: string;
  term: string;
  maxAmount: string;
  affiliateUrl: string;
}

const loanOffers: LoanOffer[] = [
  {
    lender: 'Upgrade',
    rating: 4,
    aprFrom: '7.74%',
    aprNote: 'with AutoPay',
    term: '2-7 Years',
    maxAmount: '$50K',
    affiliateUrl: '#',
  },
  {
    lender: 'Happy Money',
    rating: 4,
    aprFrom: '7.95%',
    term: '2-5 Years',
    maxAmount: '$50K',
    affiliateUrl: '#',
  },
  {
    lender: 'LightStream',
    rating: 4.5,
    aprFrom: '7.24%*',
    aprNote: 'with AutoPay',
    term: '2-7* Years',
    maxAmount: '$100K',
    affiliateUrl: '#',
  },
  {
    lender: 'SoFi',
    rating: 4.5,
    aprFrom: '8.99%',
    term: '2-7 Years',
    maxAmount: '$100K',
    affiliateUrl: '#',
  },
  {
    lender: 'Marcus by Goldman Sachs',
    rating: 4,
    aprFrom: '6.99%',
    term: '3-6 Years',
    maxAmount: '$40K',
    affiliateUrl: '#',
  },
];

const loanPurposes = [
  'Debt Consolidation',
  'Home Improvement',
  'Major Purchase',
  'Medical Expenses',
  'Wedding',
  'Moving',
  'Vacation',
  'Other',
];

const creditScores = [
  'Excellent (750+)',
  'Good (700-749)',
  'Fair (650-699)',
  'Poor (600-649)',
  'Very Poor (Below 600)',
];

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export default function LoanFinder() {
  const [loanPurpose, setLoanPurpose] = useState('Debt Consolidation');
  const [state, setState] = useState('CA');
  const [loanAmount, setLoanAmount] = useState(15000);
  const [creditScore, setCreditScore] = useState('Excellent (750+)');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} style={{ color: '#0066cc', fontSize: '1rem' }}>★</span>
        ))}
        {hasHalfStar && (
          <span style={{ color: '#0066cc', fontSize: '1rem' }}>★</span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} style={{ color: '#cbd5e1', fontSize: '1rem' }}>★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="loan-finder-section">
      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Header */}
        <div className="loan-finder-header">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#111827' }}>
            Find the Best Personal Loan for You
          </h2>
          <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>
            Get prequalified loan offers in 2 minutes or less - with no impact to your credit score.
          </p>
        </div>

        {/* CTA Box */}
        <div className="loan-finder-cta-box">
          <div className="cta-box-content">
            <div className="cta-icon">💡</div>
            <div className="cta-text">
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '0.25rem' }}>
                Check Your Personal Loan Rates
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Check personalized rates from multiple lenders in just 2 minutes. This will NOT impact your credit score.
              </div>
            </div>
          </div>
          <button className="loan-finder-cta-button">
            Find my best rate
          </button>
        </div>

        {/* Filter Inputs */}
        <div className="loan-finder-filters">
          <div className="filter-group">
            <label className="filter-label">Loan Purpose</label>
            <select 
              className="filter-select"
              value={loanPurpose}
              onChange={(e) => setLoanPurpose(e.target.value)}
            >
              {loanPurposes.map((purpose) => (
                <option key={purpose} value={purpose}>{purpose}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">State</label>
            <select 
              className="filter-select"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Loan Amount</label>
            <div className="loan-amount-input-wrapper">
              <span className="dollar-sign">$</span>
              <input
                type="number"
                className="loan-amount-input"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                min="1000"
                max="100000"
                step="1000"
              />
              <div className="amount-indicator"></div>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Credit Score</label>
            <select 
              className="filter-select"
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
            >
              {creditScores.map((score) => (
                <option key={score} value={score}>{score}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loan Offers */}
        <div className="loan-offers-list">
          {loanOffers.map((offer, index) => (
            <div key={index} className="loan-offer-card">
              <div className="loan-offer-header">
                <div className="lender-info">
                  <div className="lender-logo-placeholder">
                    {offer.lender.charAt(0)}
                  </div>
                  <div className="lender-name-rating">
                    <div className="lender-name">{offer.lender}</div>
                    {renderStars(offer.rating)}
                  </div>
                </div>
                <div className="loan-offer-details">
                  <div className="apr-section">
                    <div className="apr-label">APR from</div>
                    <div className="apr-value">{offer.aprFrom}</div>
                    {offer.aprNote && (
                      <div className="apr-note">{offer.aprNote}</div>
                    )}
                  </div>
                  <div className="term-section">
                    <div className="term-label">Term</div>
                    <div className="term-value">{offer.term}</div>
                  </div>
                  <div className="amount-section">
                    <div className="amount-label">Max Amount</div>
                    <div className="amount-value">{offer.maxAmount}</div>
                  </div>
                </div>
              </div>
              <div className="loan-offer-actions">
                <a href={offer.affiliateUrl} className="learn-more-button">
                  Learn More →
                </a>
                <a href="#" className="offer-details-link">Offer Details</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


