'use client';

interface AffiliateLinkProps {
  href: string;
  lenderName: string;
  loanType: string;
  location?: string;
  source: string;
  children: React.ReactNode;
  className?: string;
  trackClick?: boolean;
}

export default function AffiliateLink({
  href,
  lenderName,
  loanType,
  location,
  source,
  children,
  className = '',
  trackClick = true
}: AffiliateLinkProps) {
  const handleClick = () => {
    if (trackClick && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        lender: lenderName,
        loan_type: loanType,
        location: location || 'general',
        source: source
      });
    }
  };

  // Build affiliate URL with tracking parameters
  const buildAffiliateUrl = () => {
    try {
      const url = new URL(href);
      url.searchParams.set('ref', 'moneymatrix');
      url.searchParams.set('loanType', loanType);
      if (location) {
        url.searchParams.set('location', location);
      }
      url.searchParams.set('source', source);
      url.searchParams.set('utm_source', 'moneymatrix');
      url.searchParams.set('utm_medium', 'affiliate');
      url.searchParams.set('utm_campaign', `${loanType}-${location || 'general'}`);
      return url.toString();
    } catch {
      // If href is not a valid URL, return as-is
      return href;
    }
  };

  return (
    <a
      href={buildAffiliateUrl()}
      onClick={handleClick}
      className={`affiliate-link ${className}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}


