export const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
};

export const generateShortId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};
