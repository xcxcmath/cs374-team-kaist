import React, { useState, useEffect } from 'react';
import { Fab, TextField, Paper } from '@material-ui/core';
import { database } from '../stores/firebase';

/*
var name = 'Sofia';
var age = 19;
var country = 'USA';
var gender = 'female';
var bio = "I travel 5-10 times a year, my hobbies are: photography, dancing. Love walking a lot. KAIST'2023, UCLA'2019";
var travelText = "I came to South Korea attend BTS concert"
var visitText = "I want to get to GS25 convenience store to get some drinks and snacks, because we have a movie night tonight"
//var finalDest = "GS25 convenience store, 160 Cheongsa-ro";
var profilePic = 'https://s7g3.scene7.com/is/image/soloinvest/n00554A?$big_image_web$';
var status = 'waiting';
var KakaoID = "ABC";
var phone = "+8232312321";*/

export default function Biography(props) {
  const {
    name,
    age,
    country,
    gender,
    bio,
    path: pathString,
    profileImage,
    phone,
    kakao,
  } = props.companion.entry;
  const path = JSON.parse(pathString);
  const {
    travelText,
    visitText,
    onPend,
    onAccept,
    onCancel,
    onDecline,
    onReportPosted,
    status,
    userID,
  } = props;

  var contact_info;
  var buttons;
  var travel_info;
  var alertDiv;
  const [st, setSt] = useState(status);
  const [repDisplay, setRepDisplay] = useState(false);
  const [reportText, setReportText] = useState('');
  useEffect(() => {
    if (userID && props.companion.id) {
      (async () => {
        const data = await database
          .ref(`reports/${props.companion.id}/${userID}`)
          .get();
        if (data.exists()) {
          setReportText(data.val());
        } else {
          setReportText('');
        }
      })();
    }
  }, [userID, props.companion.id]);
  let repStyle = {
    display: 'none',
  };
  if (repDisplay === true) {
    repStyle = {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '4%',
      marginRight: '4%',
    };
  }
  if (st === 'accepted') {
    contact_info = (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '92%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '10px',
          }}
        >
          <TextField label="Phone number" value={phone} readonly />{' '}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '92%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '10px',
          }}
        >
          <TextField label="KakaoID" value={kakao} readonly />{' '}
        </div>
      </div>
    );
    buttons = (
      <div
        style={{
          display: 'flex',
          position: 'fixed',
          top: 'calc(99% - 50px)',
          width: '90px',
          left: '50%-45px',
        }}
      >
        <Fab
          color="secondary"
          variant="extended"
          onClick={onCancel}
          aria-label="close biography"
        >
          Go&nbsp;Back
        </Fab>
      </div>
    );
  } else if (st === 'pending') {
    buttons = (
      <div
        style={{
          display: 'flex',
          position: 'fixed',
          top: 'calc(99% - 50px)',
          width: '200px',
          left: '50%',
          marginLeft: '-100px',
        }}
      >
        <Fab
          color="secondary"
          variant="extended"
          style={{ marginRight: '6%' }}
          onClick={onDecline}
          aria-label="Decline candidate"
        >
          Decline
        </Fab>
        <Fab color="primary" variant="extended" style={{}}>
          <div style={{}} onClick={onAccept} aria-label="Accept candidate">
            Accept
          </div>
        </Fab>
      </div>
    );
  } else {
    buttons = (
      <div
        style={{
          display: 'flex',
          position: 'fixed',
          top: 'calc(99% - 50px)',
          width: '200px',
          left: '50%',
          marginLeft: '-100px',
        }}
      >
        <Fab
          color="secondary"
          variant="extended"
          style={{ marginRight: '6%' }}
          onClick={onCancel}
          aria-label="Close biography"
        >
          Go&nbsp;Back
        </Fab>
        <Fab
          color="primary"
          variant="extended"
          onClick={onPend}
          aria-label="accept candidate"
        >
          <div>Accept</div>
        </Fab>
      </div>
    );
    travel_info = (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            width: '100%',
            marginTop: '10px',
            paddingBottom: '10px',
          }}
        >
          <div
            style={{
              marginLeft: '4%',
              textAlign: 'left',
              fontFamily: 'roboto, sans-serif',
              fontSize: '20px',
              color: '#5c5c5c',
              width: '92%',
            }}
          >
            Reason for travel: {travelText}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            width: '100%',
            marginTop: '10px',
            paddingBottom: '10px',
            borderBottom: '1px #5c5c5c solid',
          }}
        >
          <div
            style={{
              marginLeft: '4%',
              textAlign: 'left',
              fontFamily: 'roboto, sans-serif',
              fontSize: '20px',
              color: '#5c5c5c',
              width: '92%',
            }}
          >
            Reason for visiting the country: {visitText}
          </div>
        </div>
      </div>
    );
  }
  return (
    <Paper
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10,
        overflow: 'scroll',
      }}
    >
      <div>
        <img src={profileImage} style={{ width: '40%' }} />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '92%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '10px',
        }}
      >
        <TextField label="Name" value={name} readonly />
        {/*<div style={{ fontFamily: 'roboto, sans-serif', fontSize: '34px' }}>
          {age}
        </div>*/}
      </div>
      {/*<div style={{ marginLeft: '4%' }}>{<HomeIcon />}</div>*/}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '92%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '10px',
        }}
      >
        <TextField label="Age" value={age} readonly />{' '}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '92%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '10px',
        }}
      >
        <TextField label="Country" value={country} readonly />{' '}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
        {/*<div style={{ marginLeft: '4%' }}>{<AccountCircleIcon />}</div>*/}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '92%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '10px',
          }}
        >
          <TextField label="Gender" value={gender} readonly />{' '}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '92%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '10px',
        }}
      >
        <TextField
          label="Final Destination"
          value={path.destination.place_name}
          readonly
        />{' '}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '92%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '10px',
        }}
      >
        <TextField label="About Companion" value={bio} readonly />{' '}
      </div>

      {contact_info}

      <div
        style={{
          width: '100%',
          marginTop: '10px',
          paddingBottom: '10px',
            marginLeft:'auto',
            marginRight:'auto'
        }}
      >
        {st === 'accepted' && (
          <Fab id="repBtn" color="secondary" variant="extended" style={{}}>
            <div style={{}} onClick={() => setRepDisplay(true)}>
              Report {name}
            </div>
          </Fab>
        )}

        <div style={repStyle}>
          <div>
            <div style={{ alignSelf: 'center' }}>
              <TextField
                id="repText"
                label="Describe bad behavior"
                multiline
                rowsMax={3}
                fullWidth
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: '7px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Fab
              color="primary"
              variant="extended"
              style={{
                position: 'absolute',
                left: '25%',
              }}
            >
              <div
                style={{}}
                onClick={() => setRepDisplay(false)}
                aria-label="Cancel report"
              >
                Cancel
              </div>
            </Fab>
            <Fab
              color="secondary"
              variant="extended"
              style={{
                position: 'absolute',
                left: '75%',
              }}
            >
              <div
                style={{}}
                onClick={async () => {
                  if (!userID || !props.companion.id) return;
                  const toUpdate = reportText === '' ? null : reportText;
                  await database
                    .ref(`reports/${props.companion.id}/${userID}`)
                    .set(toUpdate);
                  onReportPosted(reportText);
                }}
                aria-label="Submit report"
              >
                Submit
              </div>
            </Fab>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: '80px' }} />
      {buttons}
      {alertDiv}
    </Paper>
  );
}
