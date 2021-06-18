import React, { useState, useEffect } from 'react';
import { Fab, TextField, Paper, Divider } from '@material-ui/core';
import ReportIcon from '@material-ui/icons/Report';
import { database } from '../stores/firebase';

import { countryToFlag, countries } from '../utils/countries';
import './biography.css';

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
  } = props.companion?.entry;
  const countryEntry = countries.find((it) => it.code === country);
  const countryString = countryEntry
    ? `${countryToFlag(countryEntry.code)} ${countryEntry.label}`
    : '?';
  const genderString =
    gender === 'male'
      ? 'Male'
      : gender === 'female'
      ? 'Female'
      : 'Prefer not to mention';
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
  const [st, setSt] = useState(status);
  const [repDisplay, setRepDisplay] = useState(false);
  const [reportText, setReportText] = useState('');
  useEffect(() => {
    if (userID && props.companion?.id) {
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
  }, [userID, props.companion?.id]);
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
          bottom: 0,
          left: '50%',
          width: 90,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Fab
          color="secondary"
          variant="extended"
          onClick={onCancel}
          aria-label="Close Biography"
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
          bottom: 0,
          left: '50%',
          width: 200,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Fab
          color="secondary"
          variant="extended"
          style={{ marginRight: '6%' }}
          onClick={onDecline}
          aria-label="Decline Candidate"
        >
          Decline
        </Fab>
        <Fab color="primary" variant="extended" style={{}}>
          <div style={{}} onClick={onAccept} aria-label="Accept Candidate">
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
          bottom: 0,
          left: '50%',
          width: 200,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Fab
          color="secondary"
          variant="extended"
          style={{ marginRight: '6%' }}
          onClick={onCancel}
          aria-label="Close Biography"
        >
          Go&nbsp;Back
        </Fab>
        <Fab
          color="primary"
          variant="extended"
          onClick={onPend}
          aria-label="Accept Candidate"
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
            flexDirection: 'column',
            width: '92%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '10px',
          }}
        >
          <TextField label="Reason for travel" value={travelText} readonly />{' '}
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
            label="Reason for visiting the country"
            value={visitText}
            readonly
          />{' '}
        </div>
      </div>
    );
  }
  return (
    <Paper className="biography-container">
      <div>
        <img
          src={profileImage}
          style={{ width: '40%' }}
          aria-label="profile image"
        />
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
        <TextField label="Country" value={countryString} readonly />{' '}
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
          <TextField label="Gender" value={genderString} readonly />{' '}
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
      {travel_info}
      <div
        style={{
          width: '100%',
          marginTop: '10px',
          paddingBottom: '10px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {st === 'accepted' && !repDisplay && (
          <Fab
            id="repBtn"
            color="secondary"
            variant="extended"
            size="small"
            onClick={() => setRepDisplay(true)}
          >
            <ReportIcon />
            Report {name}
          </Fab>
        )}

        <div style={repStyle}>
          <Divider style={{ margin: 10 }} />
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
              justifyContent: 'space-evenly',
            }}
          >
            <Fab
              variant="extended"
              size="small"
              aria-label="Cancel report"
              onClick={() => setRepDisplay(false)}
            >
              Cancel
            </Fab>
            <Fab
              color="primary"
              variant="extended"
              size="small"
              aria-label="Submit report"
              onClick={async () => {
                if (!userID || !props.companion.id) return;
                const toUpdate = reportText === '' ? null : reportText;
                await database
                  .ref(`reports/${props.companion.id}/${userID}`)
                  .set(toUpdate);
                onReportPosted(reportText);
              }}
            >
              <ReportIcon />
              Submit
            </Fab>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: '80px' }} />
      {buttons}
    </Paper>
  );
}
