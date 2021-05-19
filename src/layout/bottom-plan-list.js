import React, { useMemo } from 'react';
import Fab from '@material-ui/core/Fab';

import {
  List,
  Paper,
  Card,
  CardHeader,
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
import DeleteIcon from '@material-ui/icons/Delete';
import { useTheme } from '@material-ui/core/styles';
import _ from 'lodash';

import { action } from 'mobx';
import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';
import DegreeLabel from '../components/degree-label';
import utils from '../utils/directions';

export default observer(function BottomPlanList() {
  const theme = useTheme();
  const { mode, setMode, flickerSwitch } = useStore();
  const { currentPlan, setCurrentPlan } = useStore((it) => it.mapStore);

  React.useEffect(() => {
    const it = _.cloneDeep(currentPlan);
    const s = JSON.stringify(it);
    const itt = JSON.parse(s);
    console.log(it);
    console.log(s);
    console.log(itt);
  }, [currentPlan]);

  if (mode !== 'main') {
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
        zIndex: 1,
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
  const [originMain, originOthers] = splitPlaceName(
    currentPlan.origin.place_name
  );
  const [destinationMain, destinationOthers] = splitPlaceName(
    currentPlan.destination.place_name
  );
  return (
    <Card
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 20,
        width: '90%',
        transform: 'translate(-50%, 0)',
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
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
              {originMain}
            </Typography>
          </span>
          <ArrowForwardIcon />
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" style={{ fontWeight: 'bold' }}>
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
            {`${utils.distanceFormatKilo(
              currentPlan.distance
            )} km, ${utils.durationFormatMin(
              currentPlan.duration
            )} min. to walk`}
          </span>
        </div>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" startIcon={<PeopleIcon />}>
          Find Companion
        </Button>
        <IconButton
          style={{ marginLeft: 'auto' }}
          variant="outlined"
          color="secondary"
          onClick={() => setCurrentPlan(null)}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
});
