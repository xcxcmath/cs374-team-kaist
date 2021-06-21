import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';
import { Fab, Slide, Paper, Typography } from '@material-ui/core';
import DegreeLabel from '../components/degree-label';
import './intro.css';

export default observer(function Intro() {
  const { openIntro, setOpenIntro, flickerSwitch } = useStore();
  return (
    <Slide in={openIntro}>
      <Paper elevation={3} className="intro-container">
        <div
          style={{
            overflow: 'wrap',
            padding: 5,
            marginBottom: 30,
            marginTop: 20,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Crime Hotspots
          </Typography>
          <Typography variant="body1" gutterBottom>
            You can see flickering <em>crime hotspots</em> on map. Degree of a
            hotspot depends on overall dangerousness of the region.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <DegreeLabel degree={1} flickerSwitch={flickerSwitch} /> : You may
            beware of misdemeanors around there.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <DegreeLabel degree={2} flickerSwitch={flickerSwitch} /> : Be
            careful! There is a severe issue about crimes.
          </Typography>
          <Typography variant="body2" gutterBottom>
            <DegreeLabel degree={3} flickerSwitch={flickerSwitch} /> :{' '}
            <strong>Very dangerous.</strong> Not recommended to pass through.
          </Typography>
          <Typography variant="body1" gutterBottom>
            You can click them on the map to see the details.
          </Typography>
        </div>
        <div style={{ overflow: 'wrap', padding: 5, marginBottom: 30 }}>
          <Typography variant="h5" gutterBottom>
            How to Find Your Companion
          </Typography>
          <Typography variant="body1" gutterBottom>
            You can find one-to-one companion for your walking plan.
          </Typography>
          <ol>
            <li>Make your walking plan first by clicking [Find Safe Path].</li>
            <li>Check and accept others' companion requests.</li>
            <li>
              If nothing to choose, you can post your own companion request.
            </li>
            <li>
              Both of the users must accept each other after checking each
              profile.
            </li>
          </ol>
        </div>
        <div style={{ overflow: 'wrap', padding: 5, marginBottom: 80 }}>
          <Typography variant="h5" gutterBottom>
            How to Get Notification about Hotspots.
          </Typography>
          <Typography variant="body1" gutterBottom>
            You can turn on <em>radar</em>, getting alarm when you approach
            nearby hotspots in the radar.
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            position: 'fixed',
            bottom: 0,
            left: '50%',
            width: 200,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Fab
            variant="extended"
            onClick={() => {
              setOpenIntro(false);
            }}
            aria-label="Close Biography"
            style={{
              left: '50%',
              transform: 'translate(-50%, 0)',
            }}
          >
            Go Back
          </Fab>
        </div>
      </Paper>
    </Slide>
  );
});
