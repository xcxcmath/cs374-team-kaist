import React, { useState, useEffect, useRef, useCallback } from 'react';
import { observer } from 'mobx-react';
import MapGL, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  Popup,
  _useMapControl as useMapControl,
} from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import * as turf from '@turf/turf/dist/js';
import useStore from '../hooks/use-store';
import utils from '../utils/directions';

import { Typography, Paper, Fab, Avatar, IconButton } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useTheme } from '@material-ui/core/styles';

import MapDirectionsControl from './map-directions-control';

import DegreeLabel, {
  circleColors,
  circleLabelColors,
} from '../components/degree-label';

const GeocoderWrapper = observer(({ mapRef, containerRef }) => {
  const { accessToken, setViewport } = useStore((it) => it.mapStore);
  const { context } = useMapControl({
    //onDragStart: (evt) => evt.stopPropagation(),
    //onClick: (evt) => evt.stopPropagation(),
  });

  if (!mapRef.current) {
    return <></>;
  }

  const onViewportChange = useCallback(
    (viewport) => utils.flyToViewport(context, {}, { ...viewport }),
    [context]
  );

  return (
    <Geocoder
      mapRef={mapRef}
      containerRef={containerRef}
      onViewportChange={setViewport}
      mapboxApiAccessToken={accessToken}
      position="top-left"
    />
  );
});

function Map() {
  const theme = useTheme();
  const {
    accessToken,
    viewport,
    setViewport,
    crimeData,
    currentPlan,
    crimePopups,
    showPopup,
    closePopup,
    setUserCoords,
  } = useStore((it) => it.mapStore);
  const { mode, flickerSwitch } = useStore();

  const trackUserLocation = false;
  const auto = true;

  const mapRef = useRef();
  const geocoderContainerRef = useRef();
  const [circles, setCircles] = useState({});

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
  }, [crimeData]);

  return (
    <div
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        zIndex: -10,
      }}
    >
      <div
        ref={geocoderContainerRef}
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          width: '50%',
        }}
      />
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
            showPopup(clickedCrimeList[0].properties.id);
          }
          console.log(e.features);
        }}
      >
        <Source id="crime-data-source" type="geojson" data={circles}>
          {[1, 2, 3].map((degree) => (
            <Layer
              key={`crime-data-layer-${degree}`}
              id={`crime-data-layer-${degree}`}
              type="fill"
              paint={{ 'fill-color': circleColors[degree][flickerSwitch] }}
              filter={['==', 'degree', degree]}
            />
          ))}
          {viewport.zoom > 12 &&
            [1, 2, 3].map((degree) => (
              <Layer
                key={`crime-data-layer-${degree}-label`}
                id={`crime-data-layer-${degree}-label`}
                type="symbol"
                layout={{
                  'text-field': `${degree}`,
                  'text-size': 36,
                  'text-font': ['Roboto Bold'],
                  'text-ignore-placement': true,
                }}
                paint={{
                  'text-color': circleLabelColors[degree][flickerSwitch],
                  'text-halo-blur': 5,
                  'text-halo-color': circleColors[degree][flickerSwitch],
                  'text-halo-width': 2,
                }}
                filter={['==', 'degree', degree]}
              />
            ))}
        </Source>
        {crimePopups.map((crime) => (
          <Popup
            key={`crime-popup-${crime.id}`}
            longitude={crime.coordinates[0]}
            latitude={crime.coordinates[1]}
            closeButton={false}
            closeOnClick={true}
            onClose={() => closePopup(crime.id)}
          >
            <div style={{ textAlign: 'left' }}>
              <Typography variant="h6">
                {crime.category}
                <DegreeLabel
                  degree={crime.degree}
                  flickerSwitch={flickerSwitch}
                />
              </Typography>
              <Typography variant="body2">{crime.description}</Typography>
            </div>
          </Popup>
        ))}
        {currentPlan && (
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
                'line-color': theme.palette.primary.main,
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
        {mode === 'plan' ? (
          <MapDirectionsControl />
        ) : (
          <GeocoderWrapper
            mapRef={mapRef}
            containerRef={geocoderContainerRef}
          />
        )}
        <NavigationControl style={{ right: 10, top: 100 }} />
        {true && (
          <GeolocateControl
            style={{ right: 10, top: 200 }}
            trackUserLocation={trackUserLocation}
            auto={auto}
            showAccuracyCircle={false}
            positionOptions={{ enableHighAccuracy: true, timeout: 6000 }}
            onGeolocate={(data) => {
              console.log(data);
              setUserCoords(data.coords);
            }}
          />
        )}
      </MapGL>
    </div>
  );
}

export default observer(Map);
