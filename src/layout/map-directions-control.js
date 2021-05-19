import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { MapContext, _useMapControl as useMapControl } from 'react-map-gl';
import { decode } from '@mapbox/polyline';

import { action } from 'mobx';
import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';

import MapDirectionsStore from '../stores/map-directions-store';
import { isEqual, throttle } from 'lodash';
import extent from 'turf-extent';
import * as turf from '@turf/turf/dist/js';

import {
  Grow,
  Icon,
  InputAdornment,
  TextField,
  CircularProgress,
  Slider,
  Typography,
  Button,
  Box,
  IconButton,
  Card,
  CardContent,
  Collapse,
  SvgIcon,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import DegreeLabel from '../components/degree-label';

import MapRoute from '../components/map-route';

import utils from '../utils/directions';

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    padding: '5px !important',
    display: 'flex',
    flexDirection: 'column',
    width: 300,
    borderRadius: 2,
    alignItems: 'center',
    transition: 'width 0.3s, height 0.3s, border 0.3s',
  },
  controlsRoot: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  autocompleteRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  slider: {
    margin: '0 auto',
    width: '75%',
    height: '50%',
  },
  messages: {
    marginTop: 5,
    width: '100%',
  },
  input: {
    margin: '5px 0',
  },
}));

const request = new XMLHttpRequest();
const api = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

const Inputs = observer(() => {
  const classes = useStyles();
  const theme = useTheme();
  const mds = useContext(MapDirectionsStore);
  const context = useContext(MapContext);
  const { viewport } = context;
  const { setMode, flickerSwitch } = useStore();
  const { accessToken, crimeData, setCurrentPlan, userCoords } = useStore(
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

  const padding = useMemo(
    () => ({
      top: mds.routePadding + 150,
      bottom: mds.routePadding,
      left: mds.routePadding,
      right: mds.routePadding,
    }),
    [mds.routePadding]
  );

  useEffect(() => {
    setStatus('init');
    setRouteToAdd(null);
    console.log('wow');
    if (mds.canFetch()) {
      mds.fetchSafeDirections(
        circles.current,
        ({ route, geojson }) => {
          console.log(route);
          setRouteToAdd({
            ...route,
            origin: originValue,
            destination: destinationValue,
            maximumDegree: mds.maximumDegree,
            geojson,
          });
          const bb = extent(geojson);
          setStatus('success');
          utils.flyToViewport(
            context,
            {},
            {
              ...context.viewport.fitBounds(
                [
                  [bb[0], bb[1]],
                  [bb[2], bb[3]],
                ],
                { padding }
              ),
            }
          );
        },
        () => {
          setStatus('fail');
          setRouteToAdd(null);
        },
        15
      );
    }
  }, [mds, originValue, destinationValue, mds.maximumDegree, padding]);

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
    const { origin, destination } = mds;
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
              padding,
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
    icon,
    buttonNotLoading
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
      renderOption={(option) => {
        const splitted = option.place_name.split(',');
        const main = splitted[0];
        const others = splitted.slice(1).join(',');
        return (
          <div>
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
              {main}
            </Typography>
            <Typography variant="body2">{others}</Typography>
          </div>
        );
      }}
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
                <InputAdornment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    buttonNotLoading
                  )}
                </InputAdornment>

                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );

  return (
    <Grow in={true}>
      <Card
        style={{
          borderWidth: 3,
          borderStyle: 'solid',
          borderColor:
            status === 'success'
              ? theme.palette.success.main
              : status === 'fail'
              ? theme.palette.error.main
              : theme.palette.primary.main,
        }}
      >
        <IconButton
          size="small"
          onClick={() => setMode('main')}
          style={{ position: 'absolute', top: 5, right: 5 }}
        >
          <CloseIcon />
        </IconButton>
        <CardContent className={classes.inputRoot}>
          <Box className={classes.controlsRoot}>
            <Box className={classes.slider}>
              <Typography variant="body2">Crime hotspot avoidance</Typography>
              <Slider
                marks={[
                  {
                    value: -2,
                    label: (
                      <DegreeLabel degree={3} flickerSwitch={flickerSwitch} />
                    ),
                  },
                  {
                    value: -1,
                    label: (
                      <DegreeLabel degree={2} flickerSwitch={flickerSwitch} />
                    ),
                  },
                  {
                    value: 0,
                    label: (
                      <DegreeLabel degree={1} flickerSwitch={flickerSwitch} />
                    ),
                  },
                  {
                    value: -3,
                    label: (
                      <span style={{ textAlign: 'left', color: 'red' }}>
                        Allow all
                      </span>
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
            </Box>
            <Box className={classes.autocompleteRoot}>
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
                '',
                <Icon size="small">
                  <img
                    style={{ backgroundColor: '#3bb2d0', borderRadius: '50%' }}
                    src="icons/depart.svg"
                    alt=""
                  />
                </Icon>,
                <>
                  {originInputValue ? (
                    <></>
                  ) : (
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (userCoords) {
                          geocode(
                            `${userCoords.longitude}, ${userCoords.latitude}`,
                            accessToken,
                            () => setOriginLoading(true),
                            (features) => {
                              setOriginLoading(false);
                              setOriginOptions(features);
                              if (features?.length) {
                                setOriginValue(features[0]);
                                if (features[0].center) {
                                  mds.createOrigin(features[0].center);
                                  animateToCoordinates(features[0].center);
                                } else {
                                  mds.clearOrigin();
                                }
                              }
                            }
                          );
                        }
                      }}
                    >
                      <SvgIcon viewBox="0 0 20 20">
                        <path
                          d={`M10 4C9 4 9 5 9 5v.1A5 5 0 0 0 5.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 0 0 9 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 0 0 3.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0 0 11 5.1V5s0-1-1-1zm0 2.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 1 0-7z`}
                        />
                        <circle id="dot" cx="10" cy="10" r="2" />
                      </SvgIcon>
                    </IconButton>
                  )}
                </>
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
                '',
                <Icon>
                  <img
                    style={{ backgroundColor: '#8a8bc9', borderRadius: '50%' }}
                    src="icons/arrive.svg"
                    alt=""
                  />
                </Icon>,
                <></>
              )}
            </Box>
          </Box>
          <Collapse
            in={status === 'success' || status === 'fail'}
            unmountOnExit
            timeout="auto"
            className={classes.messages}
          >
            {status === 'success' && routeToAdd && (
              <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <span>
                  <Typography variant="body1">
                    {`${(routeToAdd.distance / 1000).toFixed(1)}`}
                  </Typography>
                  <Typography variant="body2">km</Typography>
                </span>
                <span>
                  <Typography variant="body1">
                    {`${(routeToAdd.duration / 60).toFixed(1)}`}
                  </Typography>
                  <Typography variant="body2">min.</Typography>
                </span>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={action(() => {
                    setCurrentPlan(routeToAdd);
                    setMode('main');
                  })}
                >
                  Select
                </Button>
              </div>
            )}
            {status === 'fail' && (
              <Typography
                variant="body2"
                style={{ color: theme.palette.error.main }}
              >
                Failed to find..
              </Typography>
            )}
          </Collapse>
        </CardContent>
      </Card>
    </Grow>
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
        style={{
          backgroundColor: 'transparent',
          boxShadow: '1px',
          position: 'absolute',
          left: 5,
          top: 5,
        }}
      >
        <Inputs />
      </div>
      <MapRoute
        name="directions"
        geojson={data}
        lineColor="#2d5f99"
        lineOpacity={isValidRoute ? 1 : 0.5}
      />
    </>
  );
});
