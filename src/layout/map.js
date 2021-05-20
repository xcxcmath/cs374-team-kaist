import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import MapGL, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
} from 'react-map-gl';
import * as turf from '@turf/turf/dist/js';
import useStore from '../hooks/use-store';

import MapDirectionsControl from './map-directions-control';
import Notification from './notification';
function Map() {
  const { accessToken, viewport, setViewport, crimeData } = useStore(
    (it) => it.mapStore
  );
  const { notifications } = useStore();
  const { mode } = useStore();

  const trackUserLocation = false;
  const auto = false;

  const mapRef = useRef();
  const [circles, setCircles] = useState([{}, {}, {}]);
  const [flick, setFlick] = useState(1);

  useEffect(() => {
    const allFeatures =
      crimeData?.map(({ coordinates, category, id, degree }) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [...coordinates] },
        properties: { category, id, degree },
      })) ?? [];
    const newCircles = [1, 2, 3]
      .map((degree) =>
        allFeatures.filter(({ properties }) => properties.degree === degree)
      )
      .map((features, i) =>
        turf.buffer({ type: 'FeatureCollection', features }, 0.25, {
          units: 'kilometers',
        })
      );
    setCircles(newCircles);
  }, [crimeData]);

  useEffect(() => {
    const id = setInterval(() => {
      setFlick((prev) => (prev === 1 ? 0 : 1));
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        width: '100vw',
        height: '90vh',
        zIndex: -10,
      }}
    >
      <MapGL
        ref={mapRef}
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        width="100%"
        height="100%"
        mapboxApiAccessToken={accessToken}
        onViewportChange={setViewport}
        style={{ position: 'absolute', bottom: 0, zIndex: -5 }}
        onClick={(e) => {
          console.log(e.features);
        }}
      >
        {circles.map((it, i) => (
          <Source
            key={`crime-data-source-${i + 1}`}
            id={`crime-data-source-${i + 1}`}
            type="geojson"
            data={it}
          >
            <Layer
              id={`crime-data-layer-${i + 1}`}
              type="fill"
              paint={{
                'fill-opacity': flick === 1 ? 0.15 + 0.2 * (i + 1) : 0.15,
                'fill-color': `#f${i * 4}3b20`,
              }}
            />
          </Source>
        ))}

        {mode === 'plan' && <MapDirectionsControl />}
        
        {notifications == 'open' && <Notification/>}

        
        <NavigationControl style={{ right: 10, top: 10 }} />
        {false && (
          <GeolocateControl
            style={{ left: 10, top: 80 }}
            trackUserLocation={trackUserLocation}
            auto={auto}
          />
        )}
      </MapGL>
    </div>
  );
}

export default observer(Map);
