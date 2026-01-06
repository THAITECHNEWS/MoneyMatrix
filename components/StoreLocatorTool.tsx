'use client';

import { useState, useEffect } from 'react';
import { Store } from '@/lib/locations';
import LeadCaptureForm from './LeadCaptureForm';

const LOAN_TYPES = [
  { slug: 'payday-loans', name: 'Payday Loans', icon: '💰' },
  { slug: 'personal-loans', name: 'Personal Loans', icon: '💳' },
  { slug: 'installment-loans', name: 'Installment Loans', icon: '📅' },
  { slug: 'title-loans', name: 'Title Loans', icon: '🚗' },
  { slug: 'check-cashing', name: 'Check Cashing', icon: '💵' },
  { slug: 'pawn-loans', name: 'Pawn Loans', icon: '🏪' },
  { slug: 'cash-for-gold', name: 'Cash For Gold', icon: '✨' },
];

export default function StoreLocatorTool() {
  const [location, setLocation] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [distance, setDistance] = useState('25');
  const [selectedLoanType, setSelectedLoanType] = useState('payday-loans');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [autocomplete, setAutocomplete] = useState<any>(null);

  // Auto-detect user location
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.log('Geolocation error:', error);
      }
    );
  }, []);

  // Load Google Maps and initialize autocomplete
  useEffect(() => {
    if (typeof window === 'undefined' || mapLoaded) return;

    if ((window as any).google && (window as any).google.maps) {
      initializeMap();
      initializeAutocomplete();
      setMapLoaded(true);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      const checkLoaded = setInterval(() => {
        if ((window as any).google && (window as any).google.maps) {
          clearInterval(checkLoaded);
          initializeMap();
          initializeAutocomplete();
          setMapLoaded(true);
        }
      }, 100);
      setTimeout(() => clearInterval(checkLoaded), 10000);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if ((window as any).google && (window as any).google.maps) {
        initializeMap();
        initializeAutocomplete();
        setMapLoaded(true);
      }
    };
    document.head.appendChild(script);
  }, [mapLoaded]);

  // Initialize autocomplete for location input
  const initializeAutocomplete = () => {
    if (typeof window === 'undefined' || !(window as any).google) return;
    
    // Wait a bit for DOM to be ready
    setTimeout(() => {
      const locationInput = document.getElementById('location') as HTMLInputElement;
      if (!locationInput || autocomplete) return;

      const autocompleteInstance = new (window as any).google.maps.places.Autocomplete(locationInput, {
        types: ['(cities)'],
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address', 'geometry', 'name']
      });

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place.formatted_address) {
          setLocation(place.formatted_address);
          setZipCode('');
          
          // Update map center if geometry available
          if (place.geometry && place.geometry.location && map) {
            map.setCenter({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            });
            map.setZoom(12);
          }
        }
      });

      setAutocomplete(autocompleteInstance);
    }, 500);
  };

  // Re-initialize autocomplete when map loads
  useEffect(() => {
    if (mapLoaded && (window as any).google) {
      initializeAutocomplete();
    }
  }, [mapLoaded]);

  const initializeMap = () => {
    if (typeof window === 'undefined' || !(window as any).google) return;
    const mapElement = document.getElementById('store-map');
    if (!mapElement) return;

    // Use user location if available, otherwise default to LA
    const center = userLocation || { lat: 34.0522, lng: -118.2437 };

    const googleMap = new (window as any).google.maps.Map(mapElement, {
      zoom: userLocation ? 12 : 10,
      center: center,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    // Add user location marker if available
    if (userLocation) {
      new (window as any).google.maps.Marker({
        position: userLocation,
        map: googleMap,
        title: 'Your Location',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new (window as any).google.maps.Size(40, 40)
        },
        zIndex: 1000
      });
      
      // Center map on user location
      googleMap.setCenter(userLocation);
      googleMap.setZoom(12);
    }

    setMap(googleMap);
  };

  // Update map when user location is detected
  useEffect(() => {
    if (userLocation && map) {
      map.setCenter(userLocation);
      map.setZoom(12);
      
      // Add user location marker
      new (window as any).google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'Your Location',
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new (window as any).google.maps.Size(40, 40)
        },
        zIndex: 1000
      });
    }
  }, [userLocation, map]);

  const updateMarkers = (storeList: Store[]) => {
    if (!map || typeof window === 'undefined' || !(window as any).google) return;

    markers.forEach(marker => {
      try {
        if (marker && marker.setMap) marker.setMap(null);
      } catch (e) {}
    });

    const newMarkers: any[] = [];
    const bounds = new (window as any).google.maps.LatLngBounds();

    storeList.forEach((store) => {
      if (store.coordinates?.lat && store.coordinates?.lng) {
        try {
          const marker = new (window as any).google.maps.Marker({
            position: { lat: store.coordinates.lat, lng: store.coordinates.lng },
            map: map,
            title: store.name,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new (window as any).google.maps.Size(32, 32)
            }
          });

          const infoWindow = new (window as any).google.maps.InfoWindow({
            content: `
              <div style="padding: 0.5rem; min-width: 200px;">
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 700;">${store.name}</h3>
                <p style="margin: 0.25rem 0; font-size: 0.875rem;">${store.address}</p>
                <p style="margin: 0.25rem 0; font-size: 0.875rem;">${store.city}, ${store.state} ${store.zipCode}</p>
                ${store.phone ? `<p style="margin: 0.25rem 0;"><a href="tel:${store.phone}" style="color: #0066cc;">${store.phone}</a></p>` : ''}
                ${store.rating ? `<p style="margin: 0.25rem 0;">${store.rating.toFixed(1)} ${store.reviewCount ? `(${store.reviewCount} reviews)` : ''}</p>` : ''}
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          newMarkers.push(marker);
          bounds.extend(marker.getPosition());
        } catch (e) {
          console.error('Error creating marker:', e);
        }
      }
    });

    setMarkers(newMarkers);
    if (newMarkers.length > 0 && !bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStores([]);

    if (!location && !zipCode) {
      setError('Please enter a location or zip code');
      setLoading(false);
      return;
    }

    try {
      const apifyApiKey = process.env.NEXT_PUBLIC_APIFY_API_KEY || '';
      if (!apifyApiKey) {
        setError('Service temporarily unavailable. Please try again later.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/search-stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: location || undefined,
          zipCode: zipCode || undefined,
          distance: parseInt(distance),
          loanType: selectedLoanType,
          apifyApiKey,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        console.error('Failed to parse JSON response:', text);
        throw new Error('Invalid response from server');
      }

      console.log('API Response status:', response.status);
      console.log('API Response data:', data);

      if (!response.ok) {
        const errorMsg = data?.error || data?.details || data?.message || 'Failed to search stores';
        console.error('API Error:', errorMsg, data);
        throw new Error(errorMsg);
      }

      console.log('Search response:', data);
      
      if (data.stores && Array.isArray(data.stores) && data.stores.length > 0) {
        setStores(data.stores);
        updateMarkers(data.stores);
        setError(''); // Clear any previous errors
      } else {
        // Check if we got results but they were filtered out
        const debugInfo = data.debug ? ` (Raw: ${data.debug.rawResultsCount}, Transformed: ${data.debug.transformedCount}, After Filter: ${data.debug.afterFilterCount})` : '';
        setError(`No locations found. Try a different location or service type.${debugInfo}`);
        setStores([]); // Ensure stores is empty array
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="store-locator-tool">
      {/* Header */}
      <div className="tool-header">
        <h1>Find the Best Financial Services Near You</h1>
        <p>Compare rates, read reviews, and get the best deals from top-rated lenders in your area</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="tool-search-form">
        {/* Service Type Selector */}
        <div className="service-type-selector">
          <label className="form-label">What do you need?</label>
          <div className="service-type-grid">
            {LOAN_TYPES.map((type) => (
              <button
                key={type.slug}
                type="button"
                className={`service-type-btn ${selectedLoanType === type.slug ? 'active' : ''}`}
                onClick={() => setSelectedLoanType(type.slug)}
              >
                <span className="service-icon">{type.icon}</span>
                <span className="service-name">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location Inputs */}
        <div className="location-inputs">
          <div className="input-group">
            <label htmlFor="location">City, State or Location</label>
            <input
              id="location"
              type="text"
              placeholder="Start typing your city or location..."
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (e.target.value) setZipCode('');
              }}
              disabled={!!zipCode}
              autoComplete="off"
            />
          </div>

          <div className="input-divider">OR</div>

          <div className="input-group">
            <label htmlFor="zipcode">Zip Code</label>
            <input
              id="zipcode"
              type="text"
              placeholder="e.g., 90001"
              value={zipCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                setZipCode(value);
                if (value) setLocation('');
              }}
              maxLength={5}
            />
          </div>

          <div className="input-group">
            <label htmlFor="distance">Distance</label>
            <select
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
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
            className="search-btn"
            disabled={loading || (!location && !zipCode)}
          >
            {loading ? 'Searching...' : 'Find Locations'}
          </button>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}
      </form>

      {/* Results */}
      {stores.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h2>🎯 Top {stores.length} Best Deals Near You</h2>
            <p>Compare rates and get instant quotes from verified lenders. Click "Get Quote" to start your application.</p>
          </div>

          <div className="results-container">
            {/* Map */}
            <div className="map-section">
              <div id="store-map" style={{ width: '100%', height: '600px', borderRadius: '0.75rem' }}></div>
            </div>

            {/* Store Grid */}
            <div className="stores-grid">
              {stores.map((store, index) => (
                <div key={store.id} className="store-card-enhanced">
                  {index === 0 && (
                    <div className="best-deal-badge">🏆 BEST DEAL</div>
                  )}
                  {index >= 1 && index <= 4 && (
                    <div className="recommended-badge">⭐ RECOMMENDED</div>
                  )}
                  <div className="store-header">
                    <h3>{store.name}</h3>
                    {store.rating && (
                      <div className="store-rating">
                        {store.rating.toFixed(1)}
                        {store.reviewCount && <span> ({store.reviewCount} reviews)</span>}
                      </div>
                    )}
                  </div>

                  <div className="store-info">
                    <p className="store-address">📍 {store.address}</p>
                    <p className="store-location">{store.city}, {store.state} {store.zipCode}</p>
                    {store.phone && (
                      <p className="store-phone">
                        📞 <a href={`tel:${store.phone}`}>{store.phone}</a>
                      </p>
                    )}
                    {store.website && (
                      <p className="store-website">
                        🌐 <a href={store.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
                      </p>
                    )}
                    {store.services && store.services.length > 0 && (
                      <div className="store-services">
                        <strong>Services:</strong> {store.services.join(', ')}
                      </div>
                    )}
                    {store.hours && Object.keys(store.hours).length > 0 && (
                      <div className="store-hours">
                        <strong>Hours:</strong>
                        <ul>
                          {Object.entries(store.hours).slice(0, 3).map(([day, hours]) => (
                            <li key={day}>{day}: {hours}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    className="get-quote-btn"
                    onClick={() => setSelectedStore(store)}
                  >
                    Get Instant Quote →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lead Form Modal */}
      {selectedStore && (
        <div className="lead-modal-overlay" onClick={() => setSelectedStore(null)}>
          <div className="lead-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedStore(null)}>×</button>
            <LeadCaptureForm
              store={selectedStore}
              loanType={selectedLoanType}
              location={location || zipCode}
              onSuccess={() => setSelectedStore(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

