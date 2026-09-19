export const GOOGLE_MAPS_API_KEY = 'AIzaSyD5bcnLU8jHQC0__OeUFMXJjcuu_ZYsHDo';

let googleMapsPromise: Promise<any> | null = null;

export function getGoogleMapsLoader(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is not defined'));
  }

  // Already loaded
  if ((window as any).google && (window as any).google.maps) {
    return Promise.resolve((window as any).google);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if google is already available
    if ((window as any).google && (window as any).google.maps) {
      resolve((window as any).google);
      return;
    }

    const callbackName = `__initGoogleMaps_${Math.random().toString(36).substring(2, 9)}`;
    
    (window as any)[callbackName] = () => {
      try {
        delete (window as any)[callbackName];
      } catch (e) {
        (window as any)[callbackName] = undefined;
      }
      if ((window as any).google && (window as any).google.maps) {
        resolve((window as any).google);
      } else {
        reject(new Error('Google Maps loaded but google.maps namespace is missing'));
      }
    };

    const existingScript = document.getElementById('google-maps-script') as HTMLScriptElement | null;
    if (existingScript) {
      // If script is in DOM, wait for window.google.maps
      const interval = setInterval(() => {
        if ((window as any).google && (window as any).google.maps) {
          clearInterval(interval);
          resolve((window as any).google);
        }
      }, 50);
      setTimeout(() => {
        clearInterval(interval);
        if ((window as any).google && (window as any).google.maps) {
          resolve((window as any).google);
        } else {
          reject(new Error('Timeout waiting for Google Maps to initialize'));
        }
      }, 10000);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=${callbackName}`;
    script.async = true;
    script.defer = true;

    script.onerror = (err) => {
      try {
        delete (window as any)[callbackName];
      } catch (e) {
        (window as any)[callbackName] = undefined;
      }
      reject(new Error('Failed to load Google Maps script from Google CDN'));
    };

    const target = document.head || document.getElementsByTagName('head')[0] || document.body || document.documentElement;
    if (target) {
      target.appendChild(script);
    } else {
      reject(new Error('No document container found to append Google Maps script'));
    }
  });

  return googleMapsPromise;
}

export const AHMEDABAD_CENTER = {
  lat: 23.0338,
  lng: 72.5539
};
