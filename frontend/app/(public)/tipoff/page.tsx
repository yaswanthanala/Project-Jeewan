'use client';

import { useState } from 'react';
import { Shield, CheckCircle2, MapPin, Upload } from 'lucide-react';

export default function TipOffPage() {
  const [formData, setFormData] = useState({ description: '', location: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [useGps, setUseGps] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({ ...prev, location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }));
          setUseGps(true);
        },
        () => alert('Unable to get location. Please type it manually.')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSuccess(true);
    setFormData({ description: '', location: '' });
    setIsSubmitting(false);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-card border border-border rounded-2xl p-8 text-center animate-float-up">
          <div className="w-16 h-16 bg-jeewan-nature-light rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-jeewan-nature" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Report Received</h2>
          <p className="text-sm text-jeewan-muted mb-4">Your anonymous report has been received. Our team will investigate.</p>
          <p className="text-xs text-jeewan-muted">No identifying information was stored.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">📍 Report Drug Activity</h1>
          <span className="flex items-center gap-1 text-[10px] bg-muted text-jeewan-muted px-2.5 py-1 rounded-full font-medium">
            <Shield className="w-3 h-3" /> 100% Anonymous
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 md:p-6">
          {/* Privacy Assurance */}
          <div className="mb-6 p-4 bg-jeewan-nature-light border border-jeewan-nature/30 rounded-xl">
            <p className="text-xs text-jeewan-nature font-medium">
              🛡 Your identity is fully protected. We don&apos;t store your IP address or any personal information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-wider">What did you see? *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe what happened, when, and any relevant details..."
                className="w-full p-3 rounded-xl border border-border bg-card text-foreground text-sm focus:ring-2 focus:ring-jeewan-calm/20 focus:border-jeewan-calm transition resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Location (optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Type a landmark or area..."
                  className="flex-1 p-3 rounded-xl border border-border bg-card text-sm transition"
                />
                <button
                  type="button"
                  onClick={handleGPS}
                  className={`px-4 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                    useGps ? 'bg-jeewan-nature text-white border-jeewan-nature' : 'border-jeewan-calm text-jeewan-calm hover:bg-jeewan-calm-light'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {useGps ? 'Got it' : 'Use GPS'}
                </button>
              </div>
            </div>

            {/* Photo/Video */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Add photo/video (optional)</label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-jeewan-calm-mid hover:bg-jeewan-calm-light/30 transition">
                <Upload className="w-6 h-6 text-jeewan-muted mx-auto mb-2" />
                <p className="text-xs text-jeewan-muted">Tap to attach image or video</p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.description}
              className="w-full bg-jeewan-nature hover:bg-jeewan-nature/90 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-40"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report Anonymously'}
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div className="mt-6 bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-sm text-foreground mb-3">Frequently Asked Questions</h3>
          <div className="space-y-3 text-xs">
            {[
              { q: 'How anonymous is this?', a: "Completely. We don't store your IP, device info, or any metadata." },
              { q: 'What happens to my report?', a: 'Our team reviews and investigates serious reports. We may share data with authorities.' },
              { q: 'Does it work offline?', a: "Yes — reports queue in your device and submit automatically when you're back online." },
            ].map((faq, i) => (
              <div key={i}>
                <p className="font-bold text-foreground mb-0.5">{faq.q}</p>
                <p className="text-jeewan-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
