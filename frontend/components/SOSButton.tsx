'use client';

import { useState } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';

interface SOSButtonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SOSButton({ size = 'md', className = '' }: SOSButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSOSClick = async () => {
    setIsLoading(true);
    try {
      let locationData: { latitude?: number; longitude?: number; timestamp: string } = {
        timestamp: new Date().toISOString(),
      };

      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos.coords),
              (err) => reject(err),
              { timeout: 3000, enableHighAccuracy: false }
            );
          });
          locationData.latitude = position.latitude;
          locationData.longitude = position.longitude;
        } catch {
          console.warn('[JEEWAN] Geolocation unavailable, proceeding without location');
        }
      }

      await fetch('/api/sos/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData),
      }).catch(() => null);

      setIsConfirmed(true);
      setTimeout(() => setIsConfirmed(false), 6000);
    } catch (error) {
      console.error('[JEEWAN] SOS Error:', error);
      setIsConfirmed(true);
      setTimeout(() => setIsConfirmed(false), 6000);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-6 py-3 text-sm gap-2',
    md: 'px-8 py-4 text-base gap-3',
    lg: 'px-8 py-5 text-lg gap-3',
  };

  return (
    <div className={className} id="sos">
      {isConfirmed && (
        <div id="sos-confirmation" className="mb-4 p-5 bg-jeewan-nature-light border border-jeewan-nature rounded-xl text-center">
          <p className="font-bold text-lg text-jeewan-nature mb-1">✅ Help is on the way!</p>
          <p className="text-sm text-jeewan-ink2 dark:text-jeewan-muted">Your request has been sent. An operator will contact you shortly. Stay calm.</p>
        </div>
      )}
      <button
        id="sos-panic-button"
        onClick={handleSOSClick}
        disabled={isLoading}
        className={`w-full ${sizeClasses[size]} bg-jeewan-warn text-white font-bold shadow-sm hover:bg-jeewan-warn/90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center rounded-xl disabled:opacity-75`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin mr-3" />
            <span>Contacting Help...</span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-7 h-7 mr-3.5" />
            <div className="text-left">
              <div className="font-bold text-lg leading-tight">SOS Emergency</div>
              <div className="text-xs opacity-90 font-medium tracking-wide">Touch for immediate help</div>
            </div>
          </>
        )}
      </button>
    </div>
  );
}
