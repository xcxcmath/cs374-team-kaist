import React, { useRef, useMemo } from 'react';
import { observer } from 'mobx-react';
import MapGL, {
  NavigationControl,
  GeolocateControl,
  Source,
  Layer,
  Popup,
} from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import useStore from '../hooks/use-store';
import { useUserDatabase } from '../hooks/use-database';

import { Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import MapDirectionsControl from './map-directions-control';
import MapRoute from '../components/map-route';

import DegreeLabel, {
  circleColors,
  circleLabelColors,
} from '../components/degree-label';

const GeocoderWrapper = observer(({ mapRef, containerRef }) => {
  const { accessToken, setViewport } = useStore((it) => it.mapStore);

  if (!mapRef.current) {
    return <></>;
  }

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

function Map({ children }) {
  const theme = useTheme();
  const { userID } = useStore();
  const {
    accessToken,
    viewport,
    setViewport,
    crimeCircles,
    otherPlan,
    isOtherPlanValid,
    crimePopups,
    showPopup,
    closePopup,
    setUserCoords,
  } = useStore((it) => it.mapStore);
  const { mode, flickerSwitch } = useStore();
  const [currentPlan, ,] = useUserDatabase(userID, 'path', (text) => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  });

  const trackUserLocation = true;
  const auto = true;

  const mapRef = useRef();
  const geocoderContainerRef = useRef();

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
        <Source id="crime-data-source" type="geojson" data={crimeCircles}>
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
          <MapRoute
            name="current-plan"
            geojson={currentPlan.geojson}
            lineColor={theme.palette.primary.main}
          />
        )}
        {otherPlan && (
          <MapRoute
            name="other-plan"
            geojson={otherPlan.geojson}
            lineColor={theme.palette.secondary.main}
            lineOpacity={isOtherPlanValid ? 1 : 0.5}
          />
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
        <GeolocateControl
          style={{ right: 10, top: 200 }}
          trackUserLocation={
            trackUserLocation && true
            //['login', 'plan', 'list-request'].findIndex((it) => it === mode) ===
            //-1
          }
          auto={auto}
          showAccuracyCircle={false}
          positionOptions={{ enableHighAccuracy: true, timeout: 6000 }}
          onGeolocate={(data) => {
            console.log(data);
            setUserCoords(data.coords);
          }}
        />
        {children}
      </MapGL>
    </div>
  );
}

export default observer(Map);
