import React, { useState, useRef, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import usePlacesData, { Place } from "./usePlacesData";
import MapComponent from "./MapComponent";
import PlacesTable from "./PlacesTable";
import DeckGL from "@deck.gl/react";
import { Analytics } from "@vercel/analytics/react";

const App: React.FC = () => {
  // Fetch places data from the CSV file using the custom hook
  const { places, loading, error } = usePlacesData(
    `${process.env.PUBLIC_URL}/places.csv`
  );

  // State to track the currently selected place
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  console.log("App.tsx: Rendering with selectedPlace:", selectedPlace?.pid); // Log on every render

  // State to manage the filter/search input value
  const [filter, setFilter] = useState<string>("");

  const mapRef = useRef<typeof DeckGL | null>(null); // Ref for the DeckGL component
  const [viewState, setViewState] = useState({
    // State for the map's view
    longitude: -100,
    latitude: 40,
    zoom: 3,
    pitch: 0,
    bearing: 0,
  });

  const handleFlyTo = useCallback(
    (place: Place) => {
      setViewState({
        longitude: place.longitude,
        latitude: place.latitude,
        zoom: 10, // Adjust zoom level as needed
        pitch: 0,
        bearing: 0,
        // Smooth transition can be handled separately if needed
      });
      setSelectedPlace(place); // Also update the selected place
    },
    [setViewState, setSelectedPlace]
  );

  // Render loading and error states within the main return
  if (loading) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography>Loading data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      {/* Header section with the title */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ marginTop: 2 }}
      >
        Places Map & Table
      </Typography>

      {/* Main content area with the map and table */}
      <Box display="flex" flexGrow={1} overflow="hidden">
        {/* Map section */}
        <Box flex={1} position="relative">
          <MapComponent
            places={places}
            selectedPlace={selectedPlace}
            onSelectPlace={setSelectedPlace}
            initialViewState={viewState} // Pass the viewState
            onViewStateChange={({ viewState }) => setViewState(viewState)} // Update viewState on map interaction
          />
        </Box>

        {/* Table section */}
        <Box flex={1} overflow="auto">
          <PlacesTable
            places={places}
            filter={filter} // Current filter value
            setFilter={setFilter} // Callback to update the filter value
            onRowSelect={handleFlyTo} // Use handleFlyTo for both select and fly
            selectedPlace={selectedPlace} // Currently selected place
          />
        </Box>
      </Box>
      <Analytics />
    </Box>
  );
};

export default App;
