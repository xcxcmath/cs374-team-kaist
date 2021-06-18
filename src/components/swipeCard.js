import React, { useState, useEffect } from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Fab, Button, IconButton, Typography } from '@material-ui/core';
import TimerIcon from '@material-ui/icons/Timer';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';

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
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={props.onDeleteReqRes}
            aria-label="delete request or response"
          >
            {props.labelDeleteReqRes}
          </Button>
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
          <Button
            variant="outlined"
            color="primary"
            onClick={props.onYes}
            aria-label="Create request"
          >
            Yes
          </Button>
        </div>
      </div>
    );
  } else if (props.waiting !== true) {
    const today = new Date();
    var time;
    var hDiff = 0;
    var mDiff = 0;
    var diff = 0;
    var dDiff = 0;
    if (props.time) {
      hDiff =
        parseInt(props?.time.toString().substring(11, 13)) - today.getHours();
      mDiff =
        parseInt(props?.time.toString().substring(14, 16)) - today.getMinutes();
      dDiff =
        parseInt(props?.time.toString().substring(8, 10)) - today.getDate();
    }
    mDiff += hDiff * 60 + dDiff * 24 * 60;

    if (mDiff > 60) {
      time = Math.floor(mDiff / 60) + ' h';
    } else if (mDiff > 0) {
      time = mDiff + ' min';
    } else {
      time = false;
    }
    timeLeft = time && (
      <div
        style={{
          display: 'flex',
          textAlign: 'center',
          color: 'grey',
        }}
      >
        <div style={{ alignSelf: 'center', fontSize: 3, marginLeft: '-1vmin' }}>
          <TimerIcon style={{ fontSize: '16px' }} />
        </div>
        <div style={{ alignSelf: 'center', fontSize: '14px' }}>
          &nbsp;{time}
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
        <IconButton
          onClick={props.onLeft}
          style={{ marginLeft: '-3vmin' }}
          aria-label="previous candidate"
        >
          <ChevronLeftIcon color="action" />
        </IconButton>
      )}
      <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
        <Avatar
          alt="profile"
          src={props.image}
          style={{
            maxHeight: '17vmin',
            maxWidth: '17vmin',
            width: '60px',
            height: '60px',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '8px',
          marginRight: '6vmin',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            textAlign: 'left',
          }}
        >
          <div style={{ color: 'black' }}>{props.name}</div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              color: 'grey',
              fontSize: '14px',
            }}
          >
            {props.gender} • {props.age}
          </div>
          {timeLeft}
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
            marginTop: '5px',
          }}
        >
          <Fab
            color="primary"
            variant="extended"
            size="small"
            onClick={props.onBio}
            aria-label="candidate biography"
          >
            About&nbsp;me
          </Fab>
          {props.onDisconnect && (
            <Fab
              color="secondary"
              variant="extended"
              size="small"
              onClick={props.onDisconnect}
              aria-label="delete companion matching"
            >
              Disconnect
            </Fab>
          )}
        </div>
      </div>
      {props.onRight && (
        <IconButton
          onClick={props.onRight}
          style={{}}
          aria-label="next candidate"
        >
          <ChevronRightIcon color="action" />
        </IconButton>
      )}
    </div>
  );
}
