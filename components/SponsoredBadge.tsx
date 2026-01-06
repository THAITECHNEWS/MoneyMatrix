interface SponsoredBadgeProps {
  text?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'small' | 'medium' | 'large';
}

export default function SponsoredBadge({ 
  text = 'Sponsored',
  position = 'top-right',
  size = 'small'
}: SponsoredBadgeProps) {
  return (
    <span className={`sponsored-badge sponsored-badge-${position} sponsored-badge-${size}`}>
      {text}
    </span>
  );
}


