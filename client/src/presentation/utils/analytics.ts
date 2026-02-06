export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  // @ts-ignore
  if (typeof window !== 'undefined' && window.gtag) {
    // @ts-ignore
    window.gtag('event', eventName, params);
  } else {
    console.log('[Analytics Dev] Event:', eventName, params);
  }
};
