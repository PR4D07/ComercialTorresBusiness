interface AnalyticsParams {
  [key: string]: unknown;
}

interface AnalyticsWindow extends Window {
  gtag?: (...args: unknown[]) => void;
}

export const trackEvent = (eventName: string, params?: AnalyticsParams) => {
  const win = window as AnalyticsWindow;

  if (typeof window !== 'undefined' && typeof win.gtag === 'function') {
    win.gtag('event', eventName, params);
  } else {
    console.log('[Analytics Dev] Event:', eventName, params);
  }
};
