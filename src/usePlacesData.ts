import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export interface Place {
  pid: string;
  name: string;
  city: string;
  region: string;
  postal_code: string;
  tenant_type: string;
  longitude: number;
  latitude: number;
}

const usePlacesData = (csvUrl: string) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Papa.parse(csvUrl, {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        setPlaces(results.data as Place[]);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
      },
    });
  }, [csvUrl]);

  return { places, loading, error };
};

export default usePlacesData;
