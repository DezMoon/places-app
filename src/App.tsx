import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import usePlacesData from './usePlacesData';
import MapComponent from './MapComponent';
import PlacesTable from './PlacesTable';
import { Place } from './usePlacesData';

const App: React.FC = () => {
  // Fetch places data from the CSV file using the custom hook
  const { places, loading, error } = usePlacesData(`${process.env.PUBLIC_URL}/places.csv`);

  // State to track the currently selected place
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // State to manage the filter/search input value
  const [filter, setFilter] = useState<string>('');

  // Display a loading message while data is being fetched
  if (loading) return <div>Loading data...</div>;

  // Display an error message if there is an issue fetching the data
  if (error) return <div>Error: {error}</div>;

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* Header section with the title */}
      <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: 2 }}>
        Places Map & Table
      </Typography>

      {/* Main content area with the map and table */}
      <Box display="flex" flexGrow={1} overflow="hidden">
        {/* Map section */}
        <Box flex={1} position="relative">
          <MapComponent 
            places={places} 
            selectedPlace={selectedPlace} 
            onSelectPlace={setSelectedPlace} // Callback to update the selected place
          />
        </Box>

        {/* Table section */}
        <Box flex={1} overflow="auto">
          <PlacesTable 
            places={places} 
            filter={filter} // Current filter value
            setFilter={setFilter} // Callback to update the filter value
            onRowSelect={setSelectedPlace} // Callback to update the selected place
            selectedPlace={selectedPlace} // Currently selected place
          />
        </Box>
      </Box>
    </Box>
  );
};

export default App;