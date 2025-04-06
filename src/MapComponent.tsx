import React, { useMemo, useState, useCallback } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import StaticMap from "react-map-gl/mapbox";
import { Place } from "./usePlacesData";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

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
  const [hoveredPlace, setHoveredPlace] = useState<Place | null>(null);

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
      onHover: (info: { object?: Place; x: number; y: number }) => {
        // Add onHover
        setHoveredPlace(info.object || null);
      },
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
          onViewStateChange({
            longitude: pickingInfo.object.longitude,
            latitude: pickingInfo.object.latitude,
            zoom: 10, // Adjust zoom level
            pitch: 0,
            bearing: 0,
            transitionDuration: 500, // Optional smooth transition
          });
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
    <>
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
      {hoveredPlace && (
        <Tooltip anchorId="mouse" id="place-tooltip" place="top">
          {hoveredPlace.name}
        </Tooltip>
      )}
    </>
  );
};

export default MapComponent;
