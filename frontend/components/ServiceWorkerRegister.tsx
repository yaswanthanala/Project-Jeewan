'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', {
          scope: '/',
        })
        .then((registration) => {
          console.log('[SW] Registered:', registration);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.error('[SW] Registration failed:', error);
        });

      // Listen for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Prompt user that app has been updated
        const event = new CustomEvent('app-updated');
        window.dispatchEvent(event);
      });
    }
  }, []);

  return null;
}
