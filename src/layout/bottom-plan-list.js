import React, { useContext } from 'react';
import { MapContext } from 'react-map-gl';

import {
  Slide,
  Card,
  CardContent,
  CardActions,
  Typography,
  Icon,
  IconButton,
  Button,
  Fab,
  ButtonBase,
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
import { database } from '../stores/firebase';
import { useRequestDatabase, useUserDatabase } from '../hooks/use-database';
import MapDirectionsStore from '../stores/map-directions-store';
import DegreeLabel from '../components/degree-label';
import utils from '../utils/directions';

export default observer(function BottomPlanList() {
  const context = useContext(MapContext);
  const { viewport } = context;
  const theme = useTheme();
  const {
    mode,
    setMode,
    flickerSwitch,
    userID,
    setOpenCompanionPanel,
    setDialog,
  } = useStore();
  const [currentPlan, setCurrentPlanText] = useUserDatabase(
    userID,
    'path',
    (text) => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    }
  );
  const [companion, setCompanion] = useUserDatabase(userID, 'companion');
  const [ownRequest, setOwnRequest] = useRequestDatabase(userID);

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
        bottom: 10,
        zIndex: 2,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          maxWidth: '90vmin',
        }}
      >
        <Card style={{ width: '100%' }}>
          <CardContent style={{ padding: '5px 10px' }}>
            <Typography
              variant="h6"
              gutterBottom
              style={{ fontSize: 14 }}
              color="textSecondary"
            >
              Click below to focus
            </Typography>
            <ButtonBase
              style={{
                border: '1px solid',
                borderColor: theme.palette.primary.main,
                borderRadius: 5,
                padding: '3px 8px',
                boxShadow: '0 0 0 0.2rem ' + theme.palette.primary.main,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
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
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textOverflow: 'ellipsis',
                  textAlign: 'start',
                }}
              >
                <Icon size="small">
                  <img
                    style={{
                      backgroundColor: '#3bb2d0',
                      borderRadius: '50%',
                    }}
                    src="icons/depart.svg"
                    alt=""
                  />
                </Icon>
                <Typography
                  variant="h6"
                  style={{ fontSize: '1rem', fontWeight: 'bold' }}
                >
                  {originMain}
                </Typography>
              </span>
              <ArrowForwardIcon />
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textOverflow: 'ellipsis',
                  textAlign: 'end',
                }}
              >
                <Typography
                  noWrap
                  variant="h6"
                  style={{ fontSize: '1rem', fontWeight: 'bold' }}
                >
                  {destinationMain}
                </Typography>{' '}
                <Icon size="small">
                  <img
                    style={{
                      backgroundColor: '#8a8bc9',
                      borderRadius: '50%',
                    }}
                    src="icons/arrive.svg"
                    alt=""
                  />
                </Icon>
              </span>
            </ButtonBase>
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
                setOpenCompanionPanel(true);
              }}
            >
              {companion ? 'See' : 'Find'} Companion
            </Button>
            <IconButton
              style={{ marginLeft: 'auto' }}
              variant="outlined"
              color="secondary"
              onClick={async (e) => {
                e.stopPropagation();
                let text = 'Do you want to delete current plan?';
                if (ownRequest) {
                  text += ' Your request will be canceled as well.';
                } else if (companion) {
                  text += ' Your response will be canceled as well.';
                }
                setDialog(
                  'Deleting Your Plan',
                  text,
                  () => {},
                  async () => {
                    setCurrentPlanText(null);
                    if (ownRequest) {
                      setOwnRequest(null);
                    }
                    if (companion) {
                      setCompanion(null);
                      database
                        .ref(`users/${companion}`)
                        .update({
                          companion: null,
                          companionMessage: 'deleted',
                        });
                      const ref = database.ref(`requests/${companion}`);
                      const data = await ref.get();
                      if (data.exists()) {
                        database
                          .ref(`requests/${companion}`)
                          .update({ status: null });
                      }
                    }
                  }
                );
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
