import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import {
  MapContext,
  _useMapControl as useMapControl,
  Source,
  Layer,
} from 'react-map-gl';
import { decode } from '@mapbox/polyline';

import { action } from 'mobx';
import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';

import MapDirectionsStore from '../stores/map-directions-store';
import { isEqual, throttle } from 'lodash';
import extent from 'turf-extent';
import * as turf from '@turf/turf/dist/js';

import {
  Icon,
  InputAdornment,
  TextField,
  Paper,
  CircularProgress,
  Slider,
  Typography,
  Button,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import DegreeLabel from '../components/degree-label';

import utils from '../utils/directions';

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    padding: '2px 4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 300,
  },
  input: { marginTop: theme.spacing(2) },
  slider: { margin: theme.spacing(1), width: 250, height: 10 },
}));

const request = new XMLHttpRequest();
const api = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

const Inputs = observer(() => {
  const classes = useStyles();
  const mds = useContext(MapDirectionsStore);
  const context = useContext(MapContext);
  const { viewport } = context;
  const { setMode, flickerSwitch } = useStore();
  const { accessToken, crimeData, setCurrentPlan } = useStore(
    (it) => it.mapStore
  );
  const circles = useRef([{}, {}, {}]);
  const [originValue, setOriginValue] = useState(null);
  const [originInputValue, setOriginInputValue] = useState('');
  const [destinationValue, setDestinationValue] = useState(null);
  const [destinationInputValue, setDestinationInputValue] = useState('');
  const [originOptions, setOriginOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [originLoading, setOriginLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [tempMaximumDegree, setTempMaximumDegree] = useState(mds.maximumDegree);

  const [status, setStatus] = useState('init'); // init, success, fail
  const [routeToAdd, setRouteToAdd] = useState(null);

  useEffect(() => {
    setStatus('init');
    setRouteToAdd(null);
    if (mds.canFetch()) {
      mds.fetchSafeDirections(
        circles.current,
        ({ route, geojson }) => {
          console.log(route);
          setRouteToAdd({
            ...route,
            origin: originValue,
            destination: destinationValue,
            geojson,
          });
          setStatus('success');
        },
        () => {
          setStatus('fail');
          setRouteToAdd(null);
        },
        15
      );
    }
  }, [mds, originValue, destinationValue, mds.maximumDegree]);

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
    circles.current = newCircles;
  }, [crimeData]);

  const geocode = useMemo(
    () =>
      throttle((g, accessToken, beforeSend, callback) => {
        g = g.trim();
        if (g.length < 2) return;

        const options = ['access_token=' + accessToken];
        request.abort();
        request.open(
          'GET',
          api + encodeURIComponent(g) + '.json?' + options.join('&'),
          true
        );
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            return callback(data.features);
          }
        };
        beforeSend();
        request.send();
      }, 200),
    []
  );

  const animateToCoordinates = (coords) => {
    const { origin, destination, routePadding } = mds;
    if (
      origin.geometry &&
      destination.geometry &&
      !isEqual(origin.geometry, destination.geometry)
    ) {
      const bb = extent({
        type: 'FeatureCollection',
        features: [origin, destination],
      });

      utils.flyToViewport(
        context,
        {},
        {
          ...viewport.fitBounds(
            [
              [bb[0], bb[1]],
              [bb[2], bb[3]],
            ],
            {
              padding: {
                top: routePadding + 100,
                bottom: routePadding,
                left: routePadding,
                right: routePadding,
              },
            }
          ),
        }
      );
    } else {
      utils.flyToViewport(
        context,
        {},
        {
          ...viewport,
          longitude: coords[0],
          latitude: coords[1],
        }
      );
    }
  };

  const renderAutocomplete = (
    value,
    onChange,
    inputValue,
    onInputChange,
    options,
    loading,
    label,
    icon
  ) => (
    <Autocomplete
      value={value}
      onChange={onChange}
      inputValue={inputValue}
      onInputChange={onInputChange}
      options={options}
      loading={loading}
      style={{ width: '100%' }}
      getOptionLabel={(option) => option.place_name}
      getOptionSelected={(option, value) => option.id === value.id}
      blurOnSelect
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="standard"
          className={classes.input}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );

  return (
    <Paper component="form" className={classes.inputRoot}>
      <Typography gutterBottom>Crime Hotspots Avoidance</Typography>
      <Slider
        className={classes.slider}
        marks={[
          {
            value: -3,
            label: <DegreeLabel degree={3} flickerSwitch={flickerSwitch} />,
          },
          {
            value: -2,
            label: <DegreeLabel degree={2} flickerSwitch={flickerSwitch} />,
          },
          {
            value: -1,
            label: <DegreeLabel degree={1} flickerSwitch={flickerSwitch} />,
          },
          {
            value: 0,
            label: (
              <span style={{ textAlign: 'left', color: 'green' }}>Safest!</span>
            ),
          },
        ]}
        min={-3}
        max={0}
        step={1}
        value={-tempMaximumDegree}
        onChange={(e, v) => setTempMaximumDegree(-v)}
        onChangeCommitted={(e, v) => {
          mds.setMaximumDegree(-v);
        }}
      />
      {renderAutocomplete(
        originValue,
        (e, v) => {
          console.log(v);
          setOriginValue(v);
          if (v?.center) {
            mds.createOrigin(v.center);
            animateToCoordinates(v.center);
          } else {
            mds.clearOrigin();
          }
        },
        originInputValue,
        (e, v) => {
          setOriginInputValue(v);
          geocode(
            v,
            accessToken,
            () => setOriginLoading(true),
            (features) => {
              setOriginLoading(false);
              setOriginOptions(features);
            }
          );
        },
        originOptions,
        originLoading,
        'Origin',
        <Icon>
          <img
            style={{ backgroundColor: '#3bb2d0' }}
            src="icons/depart.svg"
            alt=""
          />
        </Icon>
      )}
      {renderAutocomplete(
        destinationValue,
        (e, v) => {
          setDestinationValue(v);
          if (v?.center) {
            mds.createDestination(v.center);
            animateToCoordinates(v.center);
          } else {
            mds.clearDestination();
          }
        },
        destinationInputValue,
        (e, v) => {
          setDestinationInputValue(v);
          geocode(
            v,
            accessToken,
            () => setDestinationLoading(true),
            (features) => {
              setDestinationLoading(false);
              setDestinationOptions(features);
            }
          );
        },
        destinationOptions,
        destinationLoading,
        'Destination',
        <Icon>
          <img
            style={{ backgroundColor: '#8a8bc9' }}
            src="icons/arrive.svg"
            alt=""
          />
        </Icon>
      )}
      {status === 'success' && routeToAdd && (
        <div>
          {`${(routeToAdd.distance / 1000).toFixed(1)} km, ${(
            routeToAdd.duration / 60
          ).toFixed(1)} min`}
          <Button
            variant="contained"
            color="primary"
            onClick={action(() => {
              setCurrentPlan(routeToAdd);
              setMode('main');
            })}
          >
            Add
          </Button>
        </div>
      )}
      {status === 'fail' && <div>Failed to find your path...</div>}
    </Paper>
  );
});

export default observer(function MapDirectionsControl() {
  const { directions, origin, destination, isValidRoute, initialize } =
    useContext(MapDirectionsStore);
  const { context, containerRef } = useMapControl({
    onDragStart: (evt) => {
      evt.stopPropagation();
    },
    onClick: (evt) => {
      evt.stopPropagation();
    },
    onScroll: (evt) => {
      evt.stopPropagation();
    },
  });
  const { map } = context;

  useEffect(() => {
    initialize();
    return () => {
      initialize();
    };
  }, [map, initialize]);

  const data = useMemo(() => {
    const geojson = {
      type: 'FeatureCollection',
      features: [origin, destination].filter((d) => d.geometry),
    };
    if (directions.length) {
      const feature = directions[0];
      const features = [];
      const decoded = decode(feature.geometry, 5).map((c) => c.reverse());
      decoded.forEach((c) => {
        var previous = features[features.length - 1];
        if (previous) {
          previous?.geometry.coordinates.push(c);
        } else {
          features.push({
            geometry: { type: 'LineString', coordinates: [c] },
            properties: {
              'route-index': 0,
              route: 'selected',
            },
          });
        }
      });
      geojson.features = geojson.features.concat(features);
    }
    return geojson;
  }, [directions, origin, destination]);

  return (
    <>
      <div
        ref={containerRef}
        className="mapboxgl-ctrl-directions mapboxgl-ctrl"
        style={{
          backgroundColor: 'white',
          boxShadow: '1px',
          position: 'absolute',
          left: 5,
          top: 5,
        }}
      >
        <Inputs />
      </div>
      <Source id="directions" data={data} type="geojson">
        <Layer
          id="directions-route-line-casing"
          type="line"
          layout={{ 'line-cap': 'round', 'line-join': 'round' }}
          paint={{
            'line-color': '#2d5f99',
            'line-width': 12,
            'line-opacity': isValidRoute ? 1 : 0.5,
          }}
          filter={['all', ['in', '$type', 'LineString']]}
        />
        <Layer
          id="directions-origin-point"
          type="circle"
          paint={{ 'circle-radius': 18, 'circle-color': '#3bb2d0' }}
          filter={[
            'all',
            ['in', '$type', 'Point'],
            ['in', 'marker-symbol', 'A'],
          ]}
        />
        <Layer
          id="directions-origin-label"
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
          id="directions-destination-point"
          type="circle"
          paint={{ 'circle-radius': 18, 'circle-color': '#8a8bc9' }}
          filter={[
            'all',
            ['in', '$type', 'Point'],
            ['in', 'marker-symbol', 'B'],
          ]}
        />
        <Layer
          id="directions-destination-label"
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
    </>
  );
});
