'use client';

import { useState } from 'react';
import { Store } from '@/lib/locations';

interface StoreSearchProps {
  loanType: string;
  onResults: (stores: Store[]) => void;
  defaultLocation?: string;
}

export default function StoreSearch({ loanType, onResults, defaultLocation }: StoreSearchProps) {
  const [location, setLocation] = useState(defaultLocation || '');
  const [zipCode, setZipCode] = useState('');
  const [distance, setDistance] = useState('25');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get Apify API key from environment
      const apifyApiKey = process.env.NEXT_PUBLIC_APIFY_API_KEY || '';
      
      if (!apifyApiKey) {
        setError('Apify API key not configured. Please add NEXT_PUBLIC_APIFY_API_KEY to environment variables.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/search-stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: location || undefined,
          zipCode: zipCode || undefined,
          distance: parseInt(distance),
          loanType,
          apifyApiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search stores');
      }

      if (data.stores && data.stores.length > 0) {
        onResults(data.stores);
      } else {
        setError('No stores found. Try a different location or zip code.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="store-search-form">
      <div className="store-search-bar">
        <div className="search-input-group">
          <label htmlFor="location-input">Location:</label>
          <input
            id="location-input"
            type="text"
            placeholder="Enter city, state or location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="search-input"
            disabled={!!zipCode}
          />
        </div>

        <div className="search-input-group">
          <label htmlFor="zip-code-input">Zip Code:</label>
          <input
            id="zip-code-input"
            type="text"
            placeholder="Enter ZIP Code"
            value={zipCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Only numbers
              setZipCode(value);
              if (value) setLocation('');
            }}
            className="search-input"
            maxLength={5}
          />
        </div>

        <div className="search-input-group">
          <label htmlFor="distance-input">Distance:</label>
          <select
            id="distance-input"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="search-input"
          >
            <option value="5">5 miles</option>
            <option value="10">10 miles</option>
            <option value="25">25 miles</option>
            <option value="50">50 miles</option>
            <option value="100">100 miles</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || (!location && !zipCode)}
          style={{ minWidth: '120px' }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div className="search-error" style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '0.5rem',
          color: '#c33'
        }}>
          {error}
        </div>
      )}

      {!process.env.NEXT_PUBLIC_APIFY_API_KEY && (
        <div className="search-warning" style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '0.5rem',
          color: '#856404',
          fontSize: '0.875rem'
        }}>
          ⚠️ Apify API key not configured. Add NEXT_PUBLIC_APIFY_API_KEY to your environment variables.
        </div>
      )}
    </form>
  );
}
