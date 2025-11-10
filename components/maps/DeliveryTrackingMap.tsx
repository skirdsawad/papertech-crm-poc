'use client'

import { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api'
import { DeliveryTracking } from '@/lib/types/sap'
import { MapPin, Package, TruckIcon } from 'lucide-react'

interface DeliveryTrackingMapProps {
  tracking: DeliveryTracking
  deliveryNo: string
}

const containerStyle = {
  width: '100%',
  height: '400px'
}

export default function DeliveryTrackingMap({ tracking, deliveryNo }: DeliveryTrackingMapProps) {
  const [center, setCenter] = useState(tracking.current_location || tracking.origin)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (tracking.current_location) {
      setCenter(tracking.current_location)
    }
  }, [tracking])

  const pathCoordinates = [
    tracking.origin,
    ...(tracking.current_location ? [tracking.current_location] : []),
    tracking.destination
  ]

  const handleMapLoad = (map: google.maps.Map) => {
    setIsLoaded(true)

    const bounds = new window.google.maps.LatLngBounds()

    bounds.extend(tracking.origin)
    bounds.extend(tracking.destination)

    if (tracking.current_location) {
      bounds.extend(tracking.current_location)
    }

    map.fitBounds(bounds)
  }

  // Use a placeholder or environment variable for the API key
  // For POC purposes, we'll use a public demo key (replace with actual key in production)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  if (!apiKey) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Google Maps API key not configured</p>
          <p className="text-sm text-gray-500 mt-1">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={8}
          onLoad={handleMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true
          }}
        >
          {isLoaded && (
            <>
              {/* Origin Marker (Warehouse) */}
              <Marker
                position={tracking.origin}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#1F6C35',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2
                }}
                title="Origin - Bangkok Warehouse"
              />

              {/* Destination Marker */}
              <Marker
                position={tracking.destination}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#DC2626',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 2
                }}
                title="Destination"
              />

              {/* Current Truck Location */}
              {tracking.current_location && (
                <Marker
                  position={tracking.current_location}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                        <path d="M15 18H9"/>
                        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                        <circle cx="17" cy="18" r="2"/>
                        <circle cx="7" cy="18" r="2"/>
                      </svg>
                    `),
                    scaledSize: new window.google.maps.Size(32, 32),
                    anchor: new window.google.maps.Point(16, 16)
                  }}
                  title={`Truck ${deliveryNo} - In Transit`}
                />
              )}

              {/* Route Line */}
              <Polyline
                path={pathCoordinates}
                options={{
                  strokeColor: '#2563EB',
                  strokeOpacity: 0.7,
                  strokeWeight: 3,
                  geodesic: true
                }}
              />
            </>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-primary" />
          <span className="text-gray-600">Origin (Bangkok)</span>
        </div>

        {tracking.current_location && (
          <div className="flex items-center space-x-2">
            <TruckIcon className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">Current Location</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-red-600" />
          <span className="text-gray-600">Destination</span>
        </div>
      </div>

      {tracking.last_updated && (
        <div className="mt-2 text-center text-xs text-gray-500">
          Last updated: {new Date(tracking.last_updated).toLocaleString('th-TH')}
        </div>
      )}
    </div>
  )
}
