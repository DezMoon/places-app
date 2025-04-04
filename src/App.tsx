import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import usePlacesData from './usePlacesData';
import MapComponent from './MapComponent';
import PlacesTable from './PlacesTable';
import { Place } from './usePlacesData';

const App: React.FC = () => {
  const { places, loading, error } = usePlacesData(`${process.env.PUBLIC_URL}/places.csv`);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [filter, setFilter] = useState<string>('');

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: 2 }}>
        Places Map & Table
      </Typography>
      <Box display="flex" flexGrow={1} overflow="hidden">
        <Box flex={1} position="relative">
          <MapComponent places={places} selectedPlace={selectedPlace} onSelectPlace={setSelectedPlace} />
        </Box>
        <Box flex={1} overflow="auto">
          <PlacesTable 
            places={places} 
            filter={filter}
            setFilter={setFilter}
            onRowSelect={setSelectedPlace} 
            selectedPlace={selectedPlace} 
          />
        </Box>
      </Box>
    </Box>
  );
};

export default App;