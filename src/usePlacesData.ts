import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Interface defining the structure of a Place object
export interface Place {
  pid: string; // Unique identifier for the place
  name: string; // Name of the place
  city: string; // City where the place is located
  region: string; // Region or state of the place
  postal_code: string; // Postal code of the place
  tenant_type: string; // Type of tenant (e.g., residential, commercial)
  longitude: number; // Longitude coordinate of the place
  latitude: number; // Latitude coordinate of the place
}

// Custom hook to fetch and parse places data from a CSV file
const usePlacesData = (csvUrl: string) => {
  // State to store the list of places
  const [places, setPlaces] = useState<Place[]>([]);
  // State to track the loading status
  const [loading, setLoading] = useState(true);
  // State to store any error that occurs during data fetching
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use Papa Parse to fetch and parse the CSV file
    Papa.parse(csvUrl, {
      header: true, // Treat the first row as headers
      download: true, // Download the CSV file from the provided URL
      dynamicTyping: true, // Automatically convert numeric fields
      complete: (results) => {
        // On successful parsing, update the places state
        setPlaces(results.data as Place[]);
        setLoading(false); // Set loading to false
      },
      error: (err) => {
        // Handle any errors that occur during parsing
        setError(err.message);
        setLoading(false); // Set loading to false
      },
    });
  }, [csvUrl]); // Re-run the effect if the CSV URL changes

  // Return the parsed places data, loading status, and error (if any)
  return { places, loading, error };
};

export default usePlacesData;
