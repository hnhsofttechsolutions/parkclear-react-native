let cachedFcmToken: string | null = null;
const tokenListeners = new Set<(token: string | null) => void>();

export const getCachedFcmToken = () => cachedFcmToken;

export const setCachedFcmToken = (token: string | null) => {
  cachedFcmToken = token;
  tokenListeners.forEach(listener => listener(token));
};

export const subscribeFcmToken = (listener: (token: string | null) => void) => {
  tokenListeners.add(listener);
  listener(cachedFcmToken);

  return () => {
    tokenListeners.delete(listener);
  };
};
