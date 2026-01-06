'use client';

import { useState, useEffect } from 'react';
import { Store } from '@/lib/locations';
import StoreSearch from './StoreSearch';
import LeadCaptureForm from './LeadCaptureForm';

interface StoreLocatorProps {
  stores: Store[];
  centerLat?: number;
  centerLng?: number;
  defaultDistance?: number;
  loanType: string;
  defaultLocation?: string;
}

export default function StoreLocator({ 
  stores: initialStores = [], 
  centerLat, 
  centerLng,
  defaultDistance = 25,
  loanType,
  defaultLocation
}: StoreLocatorProps) {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [zipCode, setZipCode] = useState('');
  const [distance, setDistance] = useState(defaultDistance.toString());
  const [selectedService, setSelectedService] = useState<string>('all');
  const [filteredStores, setFilteredStores] = useState<Store[]>(initialStores);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    // Load Google Maps script
    if (typeof window === 'undefined' || mapLoaded) return;

    // Check if Google Maps is already loaded
    if ((window as any).google && (window as any).google.maps) {
      initializeMap();
      setMapLoaded(true);
      return;
    }

    // Get API key from environment (NEXT_PUBLIC_ prefix makes it available in browser)
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key not found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.');
      return;
    }

    // Check if script is already being loaded or exists
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      // Script exists, wait for it to load
      if ((window as any).google && (window as any).google.maps) {
        initializeMap();
        setMapLoaded(true);
      } else {
        // Script exists but not loaded yet
        const checkLoaded = setInterval(() => {
          if ((window as any).google && (window as any).google.maps) {
            clearInterval(checkLoaded);
            initializeMap();
            setMapLoaded(true);
          }
        }, 100);
        
        // Cleanup interval after 10 seconds
        setTimeout(() => clearInterval(checkLoaded), 10000);
      }
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if ((window as any).google && (window as any).google.maps) {
        initializeMap();
        setMapLoaded(true);
      }
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps script. Check your API key and domain restrictions.');
    };
    
    // Add script to head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Don't remove script on cleanup - it's shared and needed
      // React will handle component unmounting
    };
  }, [mapLoaded]);

  useEffect(() => {
    filterStores();
  }, [stores, selectedService]);

  const initializeMap = () => {
    if (typeof window === 'undefined' || !(window as any).google) return;

    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const center = centerLat && centerLng 
      ? { lat: centerLat, lng: centerLng }
      : { lat: 34.0522, lng: -118.2437 }; // Default to LA

    const googleMap = new (window as any).google.maps.Map(mapElement, {
      zoom: 12,
      center,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    });

    setMap(googleMap);
    updateMarkers(stores, googleMap);
  };

  const updateMarkers = (storeList: Store[], googleMap: any) => {
    if (!googleMap || typeof window === 'undefined' || !(window as any).google) return;

    // Clear existing markers safely
    markers.forEach(marker => {
      try {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      } catch (e) {
        // Ignore errors when clearing markers
      }
    });
    
    const newMarkers: any[] = [];

    storeList.forEach((store) => {
      if (store.coordinates && store.coordinates.lat && store.coordinates.lng) {
        try {
          const marker = new (window as any).google.maps.Marker({
            position: { lat: store.coordinates.lat, lng: store.coordinates.lng },
            map: googleMap,
            title: store.name,
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new (window as any).google.maps.Size(32, 32)
            }
          });

          const infoWindow = new (window as any).google.maps.InfoWindow({
            content: `
              <div style="padding: 0.5rem;">
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 700;">${store.name}</h3>
                <p style="margin: 0.25rem 0; font-size: 0.875rem;">${store.address}</p>
                <p style="margin: 0.25rem 0; font-size: 0.875rem;">${store.city}, ${store.state} ${store.zipCode}</p>
                ${store.phone ? `<p style="margin: 0.25rem 0;"><a href="tel:${store.phone}" style="color: #0066cc;">${store.phone}</a></p>` : ''}
                ${store.services && store.services.length > 0 ? `<p style="margin: 0.25rem 0; font-size: 0.875rem;"><strong>Services:</strong> ${store.services.join(', ')}</p>` : ''}
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(googleMap, marker);
          });

          newMarkers.push(marker);
        } catch (e) {
          console.error('Error creating marker:', e);
        }
      }
    });

    setMarkers(newMarkers);

    // Fit bounds to show all markers
    if (newMarkers.length > 0 && googleMap) {
      try {
        const bounds = new (window as any).google.maps.LatLngBounds();
        newMarkers.forEach(marker => {
          const position = marker.getPosition();
          if (position) {
            bounds.extend(position);
          }
        });
        if (!bounds.isEmpty()) {
          googleMap.fitBounds(bounds);
        }
      } catch (e) {
        console.error('Error fitting bounds:', e);
      }
    }
  };

  const filterStores = () => {
    let filtered = stores;

    // Filter by service
    if (selectedService !== 'all') {
      filtered = filtered.filter(store =>
        store.services && store.services.some(s => 
          s.toLowerCase().includes(selectedService.toLowerCase())
        )
      );
    }

    setFilteredStores(filtered);
    
    // Update map markers
    if (map) {
      updateMarkers(filtered, map);
    }
  };

  const handleSearchResults = (newStores: Store[]) => {
    setStores(newStores);
    setFilteredStores(newStores);
    if (map) {
      updateMarkers(newStores, map);
    }
  };

  const uniqueServices = Array.from(
    new Set(stores.flatMap(store => store.services || []))
  );

  return (
    <div className="store-locator">
      {/* Search Bar */}
      <StoreSearch 
        loanType={loanType}
        onResults={handleSearchResults}
        defaultLocation={defaultLocation}
      />

      {/* Services Filter */}
      {uniqueServices.length > 0 && (
        <div className="services-filter">
          <label>Services:</label>
          <div className="service-options">
            <label className="service-option">
              <input
                type="radio"
                name="service"
                value="all"
                checked={selectedService === 'all'}
                onChange={(e) => setSelectedService(e.target.value)}
              />
              <span>All Services</span>
            </label>
            {uniqueServices.map((service, idx) => (
              <label key={idx} className="service-option">
                <input
                  type="radio"
                  name="service"
                  value={service}
                  checked={selectedService === service}
                  onChange={(e) => setSelectedService(e.target.value)}
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="map-container">
        <div id="map">
          {!mapLoaded && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              background: 'var(--gray-100)',
              color: 'var(--gray-600)',
              fontSize: '1.125rem'
            }}>
              Loading map...
            </div>
          )}
        </div>
      </div>

      {/* Store List */}
      <div className="store-list">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
          {filteredStores.length} Location{filteredStores.length !== 1 ? 's' : ''} Found
        </h3>
        <div className="store-list-grid">
          {filteredStores.slice(0, 20).map((store) => (
            <div key={store.id} className="store-card">
              <h4>{store.name}</h4>
              <p className="store-address">{store.address}</p>
              <p className="store-city">{store.city}, {store.state} {store.zipCode}</p>
              {store.phone && (
                <p className="store-phone">
                  <a href={`tel:${store.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                    {store.phone}
                  </a>
                </p>
              )}
              {store.website && (
                <p className="store-website" style={{ marginTop: '0.5rem' }}>
                  <a href={store.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', fontSize: '0.875rem' }}>
                    Visit Website →
                  </a>
                </p>
              )}
              {store.services && store.services.length > 0 && (
                <div className="store-services">
                  <strong>Services:</strong> {store.services.join(', ')}
                </div>
              )}
              {store.rating && (
                <div className="store-rating">
                  ⭐ {store.rating.toFixed(1)} {store.reviewCount && `(${store.reviewCount} reviews)`}
                </div>
              )}
              {store.hours && Object.keys(store.hours).length > 0 && (
                <div className="store-hours" style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  <strong>Hours:</strong>
                  <ul style={{ marginTop: '0.25rem', paddingLeft: '1.25rem' }}>
                    {Object.entries(store.hours).slice(0, 3).map(([day, hours]) => (
                      <li key={day}>{day}: {hours}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                className="btn btn-primary"
                style={{ marginTop: '1rem', width: '100%' }}
                onClick={() => setSelectedStore(store)}
              >
                Get Quote
              </button>
            </div>
          ))}
        </div>
        
        {/* Lead Capture Form Modal */}
        {selectedStore && (
          <div className="lead-form-modal" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}>
              <button
                onClick={() => setSelectedStore(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--gray-600)',
                  zIndex: 1
                }}
              >
                ×
              </button>
              <LeadCaptureForm
                store={selectedStore}
                loanType={loanType}
                location={defaultLocation}
                onSuccess={() => setSelectedStore(null)}
              />
            </div>
          </div>
        )}
        
        {filteredStores.length === 0 && (
          <div className="no-stores">
            <p>No locations found matching your criteria. Try adjusting your search filters or use the search bar above to find stores.</p>
          </div>
        )}
      </div>
    </div>
  );
}
