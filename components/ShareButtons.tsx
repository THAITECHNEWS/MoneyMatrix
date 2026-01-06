'use client';

interface ShareButtonsProps {
  articleUrl: string;
  articleTitle: string;
}

export default function ShareButtons({ articleUrl, articleTitle }: ShareButtonsProps) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = articleUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div style={{ 
      marginTop: '3rem', 
      paddingTop: '2rem', 
      borderTop: '2px solid #e5e7eb',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'center'
    }}>
      <span style={{ fontWeight: 600, color: '#6b7280' }}>Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#1da1f2',
          color: 'white',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 600
        }}
      >
        Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#1877f2',
          color: 'white',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 600
        }}
      >
        Facebook
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#0077b5',
          color: 'white',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 600
        }}
      >
        LinkedIn
      </a>
      <button
        onClick={handleCopyLink}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        Copy Link
      </button>
    </div>
  );
}





