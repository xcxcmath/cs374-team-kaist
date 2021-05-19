import { Source, Layer } from 'react-map-gl';

export const A_COLOR = '#3bb2d0';
export const B_COLOR = '#8a8bc9';

export default function MapRoute({
  name,
  geojson,
  lineColor,
  lineWidth = 12,
  lineOpacity = 1,
  circleRadius = 18,
  textSize = 15,
  ATextColor = '#fff',
  BTextColor = '#fff',
  AColor = A_COLOR,
  BColor = B_COLOR,
}) {
  return (
    <Source id={`${name}-source`} type="geojson" data={geojson}>
      <Layer
        id={`${name}-route-line-casing`}
        type="line"
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{
          'line-color': lineColor,
          'line-width': lineWidth,
          'line-opacity': lineOpacity,
        }}
        filter={['all', ['in', '$type', 'LineString']]}
      />
      <Layer
        id={`${name}-origin-point`}
        type="circle"
        paint={{ 'circle-radius': circleRadius, 'circle-color': AColor }}
        filter={['all', ['in', '$type', 'Point'], ['in', 'marker-symbol', 'A']]}
      />
      <Layer
        id={`${name}-origin-label`}
        type="symbol"
        layout={{
          'text-field': 'A',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': textSize,
        }}
        paint={{ 'text-color': ATextColor }}
        filter={['all', ['in', '$type', 'Point'], ['in', 'marker-symbol', 'A']]}
      />
      <Layer
        id={`${name}-destination-point`}
        type="circle"
        paint={{ 'circle-radius': circleRadius, 'circle-color': BColor }}
        filter={['all', ['in', '$type', 'Point'], ['in', 'marker-symbol', 'B']]}
      />
      <Layer
        id={`${name}-destination-label`}
        type="symbol"
        layout={{
          'text-field': 'B',
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': textSize,
        }}
        paint={{ 'text-color': BTextColor }}
        filter={['all', ['in', '$type', 'Point'], ['in', 'marker-symbol', 'B']]}
      />
    </Source>
  );
}
