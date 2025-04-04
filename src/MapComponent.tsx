import React, { useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import StaticMap from "react-map-gl/mapbox";
import { Place } from "./usePlacesData";

interface MapComponentProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  initialViewState: any;
  onViewStateChange: (viewState: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  initialViewState,
  onViewStateChange,
}) => {
  const scatterplotLayer = useMemo(() => {
    return new ScatterplotLayer({
      id: "scatterplot-layer",
      data: places,
      pickable: true,
      getPosition: (d: Place) => [d.longitude, d.latitude],
      getFillColor: (d: Place) => {
        console.log(
          "MapComponent.tsx: getFillColor - Current PID:",
          d.pid,
          "(Type:",
          typeof d.pid,
          ")",
          "Selected PID:",
          selectedPlace?.pid,
          "(Type:",
          typeof selectedPlace?.pid,
          ")"
        );
        if (selectedPlace && d.pid === selectedPlace.pid) {
          console.log(
            "MapComponent.tsx: getFillColor - Match found, returning green"
          );
          return [0, 255, 0, 200];
        } else {
          console.log(
            "MapComponent.tsx: getFillColor - No match, returning red"
          );
          return [255, 0, 0, 200];
        }
      },
      radiusMinPixels: 4,
      radiusMaxPixels: 10,
      onClick: (pickingInfo: { object?: Place }) => {
        console.log(
          "MapComponent.tsx: ScatterplotLayer onClick triggered",
          pickingInfo
        );
        if (pickingInfo.object) {
          console.log(
            "MapComponent.tsx: Clicked on place with PID:",
            pickingInfo.object.pid
          );
          onSelectPlace(pickingInfo.object);
        } else {
          console.log("MapComponent.tsx: Clicked on the map (no object)");
        }
      },
      updateTriggers: {
        getFillColor: [selectedPlace?.pid], // Only recalculate colors when selectedPlace.pid changes
      },
    });
  }, [places, selectedPlace, onSelectPlace]);

  return (
    <DeckGL
      initialViewState={initialViewState}
      controller={true}
      layers={[scatterplotLayer]}
      onViewStateChange={onViewStateChange}
    >
      <StaticMap
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN!}
      />
    </DeckGL>
  );
};

export default MapComponent;
