import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import MapGL, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  Popup,
} from 'react-map-gl';
import * as turf from '@turf/turf/dist/js';
import useStore from '../hooks/use-store';

import MapDirectionsControl from './map-directions-control';

function Map() {
  const { accessToken, viewport, setViewport, crimeData, currentPlan } =
    useStore((it) => it.mapStore);
  const { mode } = useStore();

  const trackUserLocation = false;
  const auto = false;

  const mapRef = useRef();
  const [circles, setCircles] = useState({});
  const [flick, setFlick] = useState(1);
  const [popupCrimeProps, setPopupCrimeProps] = useState(null);

  useEffect(() => {
    const allFeatures =
      crimeData?.map(({ coordinates, category, id, degree, description }) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [...coordinates] },
        properties: {
          category,
          id,
          degree,
          description,
          longitude: coordinates[0],
          latitude: coordinates[1],
        },
      })) ?? [];
    setCircles(
      turf.buffer({ type: 'FeatureCollection', features: allFeatures }, 0.25, {
        units: 'kilometers',
      })
    );
    /*const newCircles = [1, 2, 3]
      .map((degree) =>
        allFeatures.filter(({ properties }) => properties.degree === degree)
      )
      .map((features, i) =>
        turf.buffer({ type: 'FeatureCollection', features }, 0.25, {
          units: 'kilometers',
        })
      );
    setCircles(newCircles);*/
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
        height: '92vh',
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
          const clickedCrimeList = e.features.filter(
            (it) => it.layer.source === 'crime-data-source'
          );
          if (clickedCrimeList.length) {
            setPopupCrimeProps(clickedCrimeList[0].properties);
          }
          console.log(e.features);
        }}
      >
        <Source id="crime-data-source" type="geojson" data={circles}>
          <Layer
            id="crime-data-layer-1"
            type="fill"
            paint={{
              'fill-opacity': flick === 1 ? 0.15 + 0.2 * 1 : 0.15,
              'fill-color': '#f03b20',
            }}
            filter={['==', 'degree', 1]}
          />
          <Layer
            id="crime-data-layer-2"
            type="fill"
            paint={{
              'fill-opacity': flick === 1 ? 0.15 + 0.2 * 2 : 0.15,
              'fill-color': '#f43b20',
            }}
            filter={['==', 'degree', 2]}
          />
          <Layer
            id="crime-data-layer-3"
            type="fill"
            paint={{
              'fill-opacity': flick === 1 ? 0.15 + 0.2 * 3 : 0.15,
              'fill-color': '#f83b20',
            }}
            filter={['==', 'degree', 3]}
          />
        </Source>
        {popupCrimeProps !== null && (
          <Popup
            longitude={popupCrimeProps.longitude}
            latitude={popupCrimeProps.latitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setPopupCrimeProps(null)}
          >
            {popupCrimeProps.description}
          </Popup>
        )}
        {currentPlan !== null && (
          <Source
            id="current-plan-source"
            type="geojson"
            data={currentPlan.geojson}
          >
            <Layer
              id="current-plan-route-line-casing"
              type="line"
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-color': '#4c45b0',
                'line-width': 12,
                'line-opacity': 1,
              }}
              filter={['all', ['in', '$type', 'LineString']]}
            />
            <Layer
              id="current-plan-origin-point"
              type="circle"
              paint={{ 'circle-radius': 18, 'circle-color': '#3bb2d0' }}
              filter={[
                'all',
                ['in', '$type', 'Point'],
                ['in', 'marker-symbol', 'A'],
              ]}
            />
            <Layer
              id="current-plan-origin-label"
              type="symbol"
              layout={{
                'text-field': 'A',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 15,
              }}
              paint={{ 'text-color': '#fff' }}
              filter={[
                'all',
                ['in', '$type', 'Point'],
                ['in', 'marker-symbol', 'A'],
              ]}
            />
            <Layer
              id="current-plan-destination-point"
              type="circle"
              paint={{ 'circle-radius': 18, 'circle-color': '#8a8bc9' }}
              filter={[
                'all',
                ['in', '$type', 'Point'],
                ['in', 'marker-symbol', 'B'],
              ]}
            />
            <Layer
              id="current-plan-destination-label"
              type="symbol"
              layout={{
                'text-field': 'B',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 15,
              }}
              paint={{ 'text-color': '#fff' }}
              filter={[
                'all',
                ['in', '$type', 'Point'],
                ['in', 'marker-symbol', 'B'],
              ]}
            />
          </Source>
        )}
        {mode === 'plan' && <MapDirectionsControl />}
        <NavigationControl style={{ right: 10, top: 10 }} />
        {true && (
          <GeolocateControl
            style={{ right: 10, top: 100 }}
            trackUserLocation={trackUserLocation}
            auto={auto}
            positionOptions={{ enableHighAccuracy: true, timeout: 6000 }}
            onGeolocate={(data) => {
              console.log(data);
            }}
          />
        )}
      </MapGL>
    </div>
  );
}

export default observer(Map);
