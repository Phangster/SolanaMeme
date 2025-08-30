import { useState, useEffect } from 'react';

interface CountryData {
  country_code: string;
  country_name: string;
}

export const useCountryDetection = () => {
  const [country, setCountry] = useState<string>('Unknown');
  const [countryName, setCountryName] = useState<string>('Unknown');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('https://ipapi.co/json/');
        
        if (!response.ok) {
          throw new Error('Failed to detect country');
        }

        const data: CountryData = await response.json();
        
        if (data.country_code) {
          setCountry(data.country_code);
          setCountryName(data.country_name);
        } else {
          setCountry('Unknown');
          setCountryName('Unknown');
        }
      } catch (err) {
        console.error('Error detecting country:', err);
        setError('Failed to detect country');
        setCountry('Unknown');
        setCountryName('Unknown');
      } finally {
        setIsLoading(false);
      }
    };

    detectCountry();
  }, []);

  return {
    country,
    countryName,
    isLoading,
    error,
  };
};
