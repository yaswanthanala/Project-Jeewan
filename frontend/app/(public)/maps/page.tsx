'use client';

import RehabMap from '@/components/RehabMap';
import { MapPin, Phone, Info } from 'lucide-react';

export default function MapsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-7 w-7 text-jeewan-calm" />
              Find Rehab Centres Near You
            </h1>
            <p className="text-sm text-jeewan-muted mt-1">Locate accredited centres. Filter by type and distance.</p>
          </div>
          <span className="hidden md:flex items-center gap-1.5 text-xs text-jeewan-nature bg-jeewan-nature-light px-3 py-1.5 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-jeewan-nature" />
            GPS Active
          </span>
        </div>

        {/* Map Card */}
        <div className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-6">
          <RehabMap />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3 p-4 bg-jeewan-calm-light rounded-2xl">
            <Info className="w-5 h-5 text-jeewan-calm flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-foreground mb-1">Choosing the Right Centre</h3>
              <p className="text-xs text-jeewan-muted">Consider treatment approach, staff qualifications, success rates, and aftercare services.</p>
            </div>
          </div>
          <div className="flex gap-3 p-4 bg-jeewan-calm-light rounded-2xl">
            <Phone className="w-5 h-5 text-jeewan-calm flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-foreground mb-1">Speak with a Counsellor First</h3>
              <p className="text-xs text-jeewan-muted">Our counsellors can help you choose the right centre based on your specific needs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
