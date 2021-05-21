import React, { useState, useEffect, useMemo } from 'react';

import useStore from '../hooks/use-store';
import { observer } from 'mobx-react';

import { Source, Layer } from 'react-map-gl';
import * as turf from '@turf/turf/dist/js';

export default observer(function Radar() {
  const {
    crimeData,
    radarRadius,
    userCoords,
    addNear,
    removeNear,
    showRadar,
    clearNear,
  } = useStore((it) => it.mapStore);
  const invalidRadius = typeof radarRadius !== 'number';

  const [theta, setTheta] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setTheta((prev) => (prev + 13) % 360);
    }, 500);
    return () => {
      clearInterval(id);
    };
  }, []);

  const radar = useMemo(() => {
    if (!userCoords || invalidRadius || !showRadar) return null;

    const centerCoords = [userCoords.longitude, userCoords.latitude];
    const center = turf.point(centerCoords, { for: 'line' });
    const bufferPoint = turf.point(centerCoords, { for: 'buffer' });
    const buffer = turf.buffer(bufferPoint, radarRadius);
    const arc = turf.lineArc(center, radarRadius, theta, theta + 60);
    arc.geometry.coordinates = [
      centerCoords,
      ...arc.geometry.coordinates,
      centerCoords,
    ];
    const ret = turf.featureCollection([buffer, arc]);
    return ret;
  }, [userCoords, radarRadius, invalidRadius, theta, showRadar]);

  useEffect(() => {
    if (crimeData && userCoords && !invalidRadius && showRadar) {
      const here = turf.point([userCoords.longitude, userCoords.latitude]);
      const isInside = (coords) =>
        turf.distance(turf.point(coords), here) < radarRadius + 0.25;
      crimeData.forEach(({ coordinates, id }) => {
        if (isInside(coordinates)) {
          addNear(id);
        } else {
          removeNear(id);
        }
      });
    } else {
      clearNear();
    }
  }, [crimeData, userCoords, radarRadius, invalidRadius, addNear, removeNear, showRadar, clearNear]);

  if (!userCoords || invalidRadius || !showRadar) {
    return <></>;
  }

  return (
    <Source id="radar-source" type="geojson" data={radar}>
      <Layer
        id="radar-layer"
        type="fill"
        paint={{ 'fill-color': 'rgba(0, 150, 0, 0.1)' }}
        filter={['all', ['==', 'for', 'buffer']]}
      />
      <Layer
        id="radar-layer-line"
        type="fill"
        paint={{
          'fill-color': 'rgba(0, 50, 0, 0.1)',
        }}
        filter={['all', ['==', 'for', 'line']]}
      />
    </Source>
  );
});
