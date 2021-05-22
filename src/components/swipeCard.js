import React, { useState, useEffect } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Fab, Button, IconButton, Typography } from '@material-ui/core';
import TimerIcon from '@material-ui/icons/Timer';
import CloseIcon from '@material-ui/icons/Close';

//example call:
// <SwipeCard
//   image ="https://s7g3.scene7.com/is/image/soloinvest/n00554A?$big_image_web$"
//   name = "Sofia"
//   age = "19"
//   gender = "female"
//   travelText = "Going to GS25"
//   timeLeft = "3 min"
// />
// backgroundColor: '#FBEEEE'
export default function SwipeCard(props) {
  const [dots, setDots] = useState(1);
  const dotString = '.'.repeat(dots);

  useEffect(() => {
    const id = setInterval(() => {
      setDots((prev) => (prev % 3) + 1);
    }, 1100);
    return () => {
      clearInterval(id);
    };
  }, []);

  var timeLeft;
  if (props.empty === true && props.waiting === true) {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'white',
            width: '85%',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignSelf: 'center',
              height: '25px',
            }}
          >
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                fontFamily: 'roboto, sans-serif',
              }}
            >
              Waiting for responses{dotString}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (props.empty === true) {
    return (
      <div>
        <Typography variant="body1">
          No companions available.
          <br />
          Do you want to create new request?
        </Typography>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <Button variant="outlined" color="primary" onClick={props.onYes}>
            Yes
          </Button>
        </div>
      </div>
    );
  } else if (props.waiting === false) {
    timeLeft = (
      <div
        style={{
          display: 'flex',
          width: '70px',
          backgroundColor: 'lightblue',
          height: '35px',
          textAlign: 'center',
        }}
      >
        <div style={{ alignSelf: 'center', marginLeft: '1px' }}>
          <TimerIcon size="small" />
        </div>
        <div style={{ alignSelf: 'center', fontSize: '16px' }}>
          {props.timeLeft}
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      {props.onLeft && (
        <IconButton onClick={props.onLeft}>
          <ChevronLeftIcon color="action" />
        </IconButton>
      )}
      <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
        <img src={props.image} style={{ maxHeight: '15vmin' }} alt="profile" />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '6px',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            textAlign: 'left',
          }}
        >
          {props.name} / {props.gender} / {props.age}
          <br />
          {props.show && <>{props.phone}</>}
          {props.show && <>{props.kakao}</>}
        </div>
        <div
          style={{
            textAlign: 'left',
          }}
        >
          {props.travelText}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Fab
            color="primary"
            variant="extended"
            size="small"
            onClick={props.onBio}
          >
            Go&nbsp;to&nbsp;Bio
          </Fab>
          {timeLeft}
        </div>
      </div>
      {props.onRight && (
        <IconButton onClick={props.onRight}>
          <ChevronRightIcon color="action" />
        </IconButton>
      )}
    </div>
  );
}
