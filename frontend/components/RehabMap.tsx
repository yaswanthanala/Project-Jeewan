'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { MapPin, Filter } from 'lucide-react';

// Dynamically import Leaflet to avoid SSR issues
const DynamicMap = dynamic(() => import('./RehabMapInner'), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-lg"><div>Loading map...</div></div>,
});

export interface RehabCenter {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'government' | 'private';
  beds: number;
  services: string[];
  phone: string;
  distance?: number;
}

export const SAMPLE_CENTERS: RehabCenter[] = [
  {
    id: '1',
    name: 'National De-addiction Center',
    lat: 28.6139,
    lng: 77.2090,
    type: 'government',
    beds: 150,
    services: ['De-addiction', 'Counselling', 'Aftercare'],
    phone: '011-1234-5678',
  },
  {
    id: '2',
    name: 'Hope Recovery Center',
    lat: 28.6200,
    lng: 77.2150,
    type: 'private',
    beds: 75,
    services: ['Residential', 'Outpatient', 'Family Therapy'],
    phone: '011-9876-5432',
  },
  {
    id: '3',
    name: 'Rehabilitation & Care Institute',
    lat: 28.6050,
    lng: 77.2000,
    type: 'government',
    beds: 120,
    services: ['De-addiction', 'Medical Care', 'Skill Development'],
    phone: '011-5555-6666',
  },
];

export default function RehabMap() {
  const [filter, setFilter] = useState<'all' | 'government' | 'private'>('all');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [centers, setCenters] = useState<RehabCenter[]>(SAMPLE_CENTERS);

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.log('[v0] Geolocation error:', error);
        // Default to Delhi
        setUserLocation([28.6139, 77.2090]);
      }
    );
  }, []);

  const filteredCenters = centers.filter(
    (center) => filter === 'all' || center.type === filter
  );

  const handleCallCenter = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          className={filter === 'all' ? 'bg-jeewan-calm hover:bg-jeewan-calm/90' : ''}
        >
          <Filter className="h-4 w-4 mr-2" />
          All Centers ({centers.length})
        </Button>
        <Button
          onClick={() => setFilter('government')}
          variant={filter === 'government' ? 'default' : 'outline'}
          className={filter === 'government' ? 'bg-jeewan-calm hover:bg-jeewan-calm/90' : ''}
        >
          Government
        </Button>
        <Button
          onClick={() => setFilter('private')}
          variant={filter === 'private' ? 'default' : 'outline'}
          className={filter === 'private' ? 'bg-jeewan-calm hover:bg-jeewan-calm/90' : ''}
        >
          Private
        </Button>
      </div>

      {/* Map */}
      {userLocation && (
        <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
          <DynamicMap userLocation={userLocation} centers={filteredCenters} />
        </div>
      )}

      {/* Centers List */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-white">
          {filteredCenters.length} Centres Found
        </h3>
        {filteredCenters.map((center) => (
          <div
            key={center.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{center.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {center.type === 'government' ? '🏛️ Government' : '🏥 Private'} · {center.beds} beds
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Services: {center.services.join(', ')}
            </p>

            <Button
              onClick={() => handleCallCenter(center.phone)}
              size="sm"
              className="w-full bg-jeewan-calm hover:bg-jeewan-calm/90 text-white"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Call: {center.phone}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
