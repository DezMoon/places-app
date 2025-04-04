import React from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import StaticMap from 'react-map-gl/mapbox';
import { Place } from './usePlacesData';

interface MapComponentProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ places, selectedPlace, onSelectPlace }) => {
  const initialViewState = {
    longitude: -100,
    latitude: 40,
    zoom: 3,
    pitch: 0,
    bearing: 0,
  };

  const scatterplotLayer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data: places,
    pickable: true,
    getPosition: (d: Place) => [d.longitude, d.latitude],
    getFillColor: (d: Place) => (selectedPlace && d.pid === selectedPlace.pid ? [0, 255, 0, 200] : [255, 0, 0, 200]),
    radiusMinPixels: 4,
    radiusMaxPixels: 10,
    onClick: (pickingInfo: { object?: Place }) => {
      if (pickingInfo.object) {
        onSelectPlace(pickingInfo.object);
      }
    },
  });

  return (
    <DeckGL initialViewState={initialViewState} controller layers={[scatterplotLayer]}>
      <StaticMap mapStyle="mapbox://styles/mapbox/light-v10" mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN!} />
    </DeckGL>
  );
};

export default MapComponent;