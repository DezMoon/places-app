import React from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import StaticMap from 'react-map-gl/mapbox';
import { Place } from './usePlacesData';

// Props interface for the MapComponent
interface MapComponentProps {
  places: Place[]; // Array of places to display on the map
  selectedPlace: Place | null; // Currently selected place
  onSelectPlace: (place: Place) => void; // Callback to handle place selection
}

const MapComponent: React.FC<MapComponentProps> = ({ places, selectedPlace, onSelectPlace }) => {
  // Initial view state for the map (center, zoom, pitch, and bearing)
  const initialViewState = {
    longitude: -100, // Initial longitude (center of the map)
    latitude: 40, // Initial latitude (center of the map)
    zoom: 3, // Initial zoom level
    pitch: 0, // Map pitch (tilt)
    bearing: 0, // Map bearing (rotation)
  };

  // Define the scatterplot layer for rendering points on the map
  const scatterplotLayer = new ScatterplotLayer({
    id: 'scatterplot-layer', // Unique ID for the layer
    data: places, // Data source for the layer
    pickable: true, // Enable picking (click events)
    getPosition: (d: Place) => [d.longitude, d.latitude], // Extract coordinates for each place
    getFillColor: (d: Place) =>
      selectedPlace && d.pid === selectedPlace.pid
        ? [0, 255, 0, 200] // Highlight selected place in green
        : [255, 0, 0, 200], // Default color for other places (red)
    radiusMinPixels: 4, // Minimum radius of points
    radiusMaxPixels: 10, // Maximum radius of points
    onClick: (pickingInfo: { object?: Place }) => {
      // Handle click events on points
      if (pickingInfo.object) {
        onSelectPlace(pickingInfo.object); // Update the selected place
      }
    },
  });

  return (
    <DeckGL
      initialViewState={initialViewState} // Set the initial view state
      controller // Enable map controls (zoom, pan, rotate)
      layers={[scatterplotLayer]} // Add the scatterplot layer to the map
    >
      {/* StaticMap renders the base map using Mapbox */}
      <StaticMap
        mapStyle="mapbox://styles/mapbox/light-v10" // Mapbox style URL
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN!} // Access token for Mapbox
      />
    </DeckGL>
  );
};

export default MapComponent;