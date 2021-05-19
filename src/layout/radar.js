import React, { useState, useEffect, useMemo } from 'react';

import useStore from '../hooks/use-store';
import { observer } from 'mobx-react';

import { Source, Layer } from 'react-map-gl';
import * as turf from '@turf/turf/dist/js';

import { useTheme } from '@material-ui/core/styles';

export default observer(function Radar() {
  const { crimeData, radarRadius, userCoords, showPopup } = useStore(
    (it) => it.mapStore
  );
  const theme = useTheme();

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
    if (!userCoords || !radarRadius) return null;

    const centerCoords = [userCoords.longitude, userCoords.latitude];
    const center = turf.point(centerCoords, { for: 'line' });
    const bufferPoint = turf.point(centerCoords, { for: 'buffer' });
    const buffer = turf.buffer(bufferPoint, radarRadius);
    const arc = turf.lineArc(center, radarRadius, theta, theta + 30);
    arc.geometry.coordinates = [
      centerCoords,
      ...arc.geometry.coordinates,
      centerCoords,
    ];
    const ret = turf.featureCollection([buffer, arc]);
    return ret;
  }, [userCoords, radarRadius, theta]);

  useEffect(() => {
    if (crimeData && userCoords && radarRadius) {
      const here = turf.point([userCoords.longitude, userCoords.latitude]);
      crimeData.forEach(({ coordinates, id }) => {
        if (turf.distance(turf.point(coordinates), here) < radarRadius + 0.25) {
          showPopup(id);
        }
      });
    }
  }, [crimeData, userCoords, radarRadius, showPopup]);

  if (!userCoords || !radarRadius) {
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
