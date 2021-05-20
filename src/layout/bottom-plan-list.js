import React, { useContext } from 'react';
import { MapContext } from 'react-map-gl';
import Fab from '@material-ui/core/Fab';

import {
  Slide,
  Card,
  CardContent,
  CardActions,
  Typography,
  Icon,
  IconButton,
  Button,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DirectionsIcon from '@material-ui/icons/Directions';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import PeopleIcon from '@material-ui/icons/PeopleAlt';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import { useTheme } from '@material-ui/core/styles';

import extent from 'turf-extent';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';
import MapDirectionsStore from '../stores/map-directions-store';
import DegreeLabel from '../components/degree-label';
import utils from '../utils/directions';

export default observer(function BottomPlanList() {
  const context = useContext(MapContext);
  const { viewport } = context;
  const theme = useTheme();
  const { mode, setMode, flickerSwitch } = useStore();
  const { currentPlan, setCurrentPlan } = useStore((it) => it.mapStore);
  const mds = useContext(MapDirectionsStore);

  if (mode === 'plan') {
    return <></>;
  }

  const Wrapper = ({ children, bottom }) => (
    <div
      className="plan-list"
      style={{
        position: 'absolute',
        left: 0,
        bottom,
        width: '100%',
      }}
    >
      {children}
    </div>
  );

  if (!currentPlan) {
    return (
      <Wrapper bottom={10}>
        <Fab
          color="primary"
          variant="extended"
          onClick={action(() => {
            setMode('plan');
          })}
        >
          <DirectionsIcon />
          Find Safe Path
        </Fab>
      </Wrapper>
    );
  }
  const splitPlaceName = (name) => {
    const s = name.split(',');
    return [s[0], s.slice(1).join(',')];
  };
  const [originMain] = splitPlaceName(currentPlan.origin.place_name);
  const [destinationMain] = splitPlaceName(currentPlan.destination.place_name);
  return (
    <Slide
      direction="right"
      in={true}
      mountOnEnter
      unmountOnExit
      style={{
        position: 'absolute',
        width: '100%',
        bottom: 30,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Card
          style={{
            width: '90vmin',
          }}
          onClick={() => {
            const bb = extent(currentPlan.geojson);
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
                    padding: mds.routePadding,
                  }
                ),
              }
            );
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              style={{ fontSize: 14 }}
              color="textSecondary"
            >
              Your current plan
            </Typography>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Icon size="small">
                  <img
                    style={{ backgroundColor: '#3bb2d0', borderRadius: '50%' }}
                    src="icons/depart.svg"
                    alt=""
                  />
                </Icon>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  {originMain}
                </Typography>
              </span>
              <ArrowForwardIcon />
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  {destinationMain}
                </Typography>{' '}
                <Icon size="small">
                  <img
                    style={{ backgroundColor: '#8a8bc9', borderRadius: '50%' }}
                    src="icons/arrive.svg"
                    alt=""
                  />
                </Icon>
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <Typography
                variant="body2"
                style={
                  currentPlan.maximumDegree === 0
                    ? { color: theme.palette.success.dark }
                    : {}
                }
              >
                {currentPlan.maximumDegree === 0 ? (
                  'Safest option'
                ) : (
                  <span>
                    Degree &le;{' '}
                    <DegreeLabel
                      degree={currentPlan.maximumDegree}
                      flickerSwitch={flickerSwitch}
                    />
                  </span>
                )}
              </Typography>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <DirectionsWalkIcon />
                <span>
                  <strong>{`${utils.distanceFormatKilo(
                    currentPlan.distance
                  )}`}</strong>{' '}
                  km,{' '}
                  <strong>{`${utils.durationFormatMin(
                    currentPlan.duration
                  )}`}</strong>{' '}
                  min.
                </span>
              </span>
            </div>
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PeopleIcon />}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Find Companion
            </Button>
            <IconButton
              style={{ marginLeft: 'auto' }}
              variant="outlined"
              color="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPlan(null);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      </div>
    </Slide>
  );
});
