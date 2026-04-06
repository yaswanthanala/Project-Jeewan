'use client';

import { useEffect } from 'react';

export default function PwaRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(
            (registration) => {
              // console.log('ServiceWorker registration successful');
            },
            (err) => {
              // console.log('ServiceWorker registration failed: ', err);
            }
          );
        });
      } else {
        // Dev mode: Unregister any existing service workers to unbreak Next.js HMR!
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (let registration of registrations) {
            registration.unregister();
          }
        });
      }
    }
  }, []);

  return null;
}
