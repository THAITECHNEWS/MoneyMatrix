'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Lender {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  aprRange: string;
  minAmount: string;
  maxAmount: string;
  fundingTime: string;
  affiliateUrl: string;
  sponsored?: boolean;
  highlights: string[];
}

interface FeaturedLendersProps {
  lenders: Lender[];
  loanType: string;
  location?: string;
  showSponsored?: boolean;
}

export default function FeaturedLenders({ 
  lenders, 
  loanType,
  location,
  showSponsored = true
}: FeaturedLendersProps) {
  const [trackedClicks, setTrackedClicks] = useState<Set<string>>(new Set());

  const handleAffiliateClick = (lender: Lender) => {
    // Track click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        lender: lender.name,
        loan_type: loanType,
        location: location,
        sponsored: lender.sponsored
      });
    }

    // Add to tracked clicks
    setTrackedClicks(prev => new Set(prev).add(lender.id));

    // Build affiliate URL
    const params = new URLSearchParams({
      ref: 'moneymatrix',
      loanType,
      ...(location && { location }),
      utm_source: 'moneymatrix',
      utm_medium: 'affiliate',
      utm_campaign: `${loanType}-${location || 'general'}`
    });

    const affiliateUrl = `${lender.affiliateUrl}?${params.toString()}`;
    
    // Open in new tab
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  // Separate sponsored and regular lenders
  const sponsoredLenders = showSponsored ? lenders.filter(l => l.sponsored) : [];
  const regularLenders = lenders.filter(l => !l.sponsored);

  return (
    <section className="featured-lenders-section">
      {sponsoredLenders.length > 0 && (
        <div className="sponsored-lenders">
          <div className="section-header">
            <h2>Featured Lenders</h2>
            <span className="sponsored-badge">Sponsored</span>
          </div>
          <div className="lenders-grid">
            {sponsoredLenders.map((lender) => (
              <div key={lender.id} className="lender-card lender-card-sponsored">
                {lender.sponsored && (
                  <span className="sponsored-indicator">Featured</span>
                )}
                {lender.logo && (
                  <div className="lender-logo">
                    <img src={lender.logo} alt={lender.name} />
                  </div>
                )}
                <h3>{lender.name}</h3>
                <div className="lender-rating">
                  <span className="stars">{'★'.repeat(Math.floor(lender.rating))}</span>
                  <span className="rating-text">
                    {lender.rating.toFixed(1)} ({lender.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="lender-details">
                  <div className="detail-item">
                    <span className="label">APR:</span>
                    <span className="value">{lender.aprRange}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Amount:</span>
                    <span className="value">{lender.minAmount} - {lender.maxAmount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Funding:</span>
                    <span className="value">{lender.fundingTime}</span>
                  </div>
                </div>
                {lender.highlights.length > 0 && (
                  <ul className="lender-highlights">
                    {lender.highlights.slice(0, 3).map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => handleAffiliateClick(lender)}
                  className="btn btn-primary btn-block lender-apply-btn"
                >
                  Apply Now
                </button>
                <p className="affiliate-disclosure">
                  We may earn a commission if you apply
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {regularLenders.length > 0 && (
        <div className="regular-lenders">
          <h2>Top Lenders</h2>
          <div className="lenders-grid">
            {regularLenders.map((lender) => (
              <div key={lender.id} className="lender-card">
                {lender.logo && (
                  <div className="lender-logo">
                    <img src={lender.logo} alt={lender.name} />
                  </div>
                )}
                <h3>{lender.name}</h3>
                <div className="lender-rating">
                  <span className="stars">{'★'.repeat(Math.floor(lender.rating))}</span>
                  <span className="rating-text">
                    {lender.rating.toFixed(1)} ({lender.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="lender-details">
                  <div className="detail-item">
                    <span className="label">APR:</span>
                    <span className="value">{lender.aprRange}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Amount:</span>
                    <span className="value">{lender.minAmount} - {lender.maxAmount}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleAffiliateClick(lender)}
                  className="btn btn-secondary btn-block lender-apply-btn"
                >
                  Compare Rates
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}




