'use client';

import { useState } from 'react';
import { RehabCenter } from './RehabMap';
import { MapPin } from 'lucide-react';

interface RehabMapInnerProps {
  userLocation: [number, number];
  centers: RehabCenter[];
}

export default function RehabMapInner({ userLocation, centers }: RehabMapInnerProps) {
  const [selectedCenter, setSelectedCenter] = useState<RehabCenter | null>(null);

  // Calculate distance between two coordinates (simple approximation)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const centersWithDistance = centers.map((center) => ({
    ...center,
    distance: parseFloat(calculateDistance(userLocation[0], userLocation[1], center.lat, center.lng)),
  }));

  const sortedCenters = [...centersWithDistance].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

  return (
    <div className="space-y-4">
      {/* Map Placeholder with iframe */}
      <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation[1] - 0.05},${userLocation[0] - 0.05},${userLocation[1] + 0.05},${userLocation[0] + 0.05}&layer=mapnik&marker=${userLocation[0]},${userLocation[1]}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Rehabilitation Centers Map"
        />
      </div>

      {/* Centers List */}
      <div className="grid gap-3 max-h-80 overflow-y-auto">
        {sortedCenters.map((center) => (
          <button
            key={center.id}
            onClick={() => setSelectedCenter(center)}
            className={`p-4 rounded-lg border-2 transition text-left ${
              selectedCenter?.id === center.id
                ? 'border-primary bg-primary/10 dark:bg-primary/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 ${center.type === 'government' ? 'text-secondary' : 'text-accent'}`}>
                <MapPin size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{center.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {center.type === 'government' ? '🏛️ Government' : '🏥 Private'} • {center.beds} beds
                </p>
                <p className="text-xs font-medium text-primary mt-1">{center.distance} km away</p>
                <p className="text-xs text-muted-foreground mt-1">{center.phone}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {center.services.slice(0, 2).map((service, i) => (
                    <span key={i} className="text-xs bg-secondary/20 text-secondary dark:text-green-400 px-2 py-1 rounded">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Center Details */}
      {selectedCenter && (
        <div className="p-4 bg-card rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg mb-2">{selectedCenter.name}</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Type:</strong> {selectedCenter.type === 'government' ? 'Government' : 'Private'}
            </p>
            <p>
              <strong>Distance:</strong> {selectedCenter.distance} km
            </p>
            <p>
              <strong>Capacity:</strong> {selectedCenter.beds} beds
            </p>
            <p>
              <strong>Phone:</strong> {selectedCenter.phone}
            </p>
            <p>
              <strong>Services:</strong> {selectedCenter.services.join(', ')}
            </p>
            <button className="mt-3 w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
              Contact Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
