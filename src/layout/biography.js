import React, { useState, useEffect, createElement } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import PlaceIcon from '@material-ui/icons/Place';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Fab, TextField, Paper } from '@material-ui/core';
import RequestAlert from './../components/requestAlert';
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
            alignItems: 'flex-start',
            width: '100%',
            marginTop: '10px',
          }}
        >
          <div
            style={{
              marginLeft: '4%',
              textAlign: 'left',
              fontFamily: 'roboto, sans-serif',
              fontSize: '20px',
              width: '92%',
            }}
          >
            Contact Information:
          </div>
        </div>
        <div
          style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}
        >
          <div
            style={{
              marginLeft: '4%',
              textAlign: 'left',
              fontFamily: 'roboto, sans-serif',
              fontSize: '20px',
              width: '92%',
            }}
          >
            Phone number: {phone}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            width: '100%',
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
              width: '92%',
            }}
          >
            KakaoID: {kakao}
          </div>
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
          left: '50%',
          marginLeft: '-45px',
        }}
      >
        <Fab color="secondary" variant="extended" onClick={onCancel}>
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
        >
          Decline
        </Fab>
        <Fab color="primary" variant="extended" style={{}}>
          <div style={{}} onClick={onAccept}>
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
        >
          Go&nbsp;Back
        </Fab>
        <Fab color="primary" variant="extended" onClick={onPend}>
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
        <img src={profileImage} style={{ width: '100%' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
        <div
          style={{
            fontFamily: 'roboto, sans-serif',
            marginLeft: '4%',
            fontSize: '34px',
            fontWeight: 'bold',
          }}
        >
          {name},{' '}
        </div>
        <div style={{ fontFamily: 'roboto, sans-serif', fontSize: '34px' }}>
          {age}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ marginLeft: '4%' }}>{<HomeIcon />}</div>
        <div
          style={{
            alignSelf: 'center',
            textAlign: 'left',
            fontFamily: 'roboto, sans-serif',
          }}
        >
          {' '}
          home country: {country}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
        <div style={{ marginLeft: '4%' }}>{<AccountCircleIcon />}</div>
        <div
          style={{
            alignSelf: 'center',
            textAlign: 'left',
            fontFamily: 'roboto, sans-serif',
          }}
        >
          gender: {gender}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          paddingBottom: '10px',
          borderBottom: '1px #5c5c5c solid',
        }}
      >
        <div style={{ marginLeft: '4%' }}>{<PlaceIcon />}</div>
        <div
          style={{
            alignSelf: 'center',
            textAlign: 'left',
            fontFamily: 'roboto, sans-serif',
          }}
        >
          final destination: {path.destination.place_name}
        </div>
      </div>
      {contact_info}

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
          About myself: {bio}
        </div>
      </div>
      <div
        style={{
          width: '100%',
          marginTop: '10px',
          paddingBottom: '10px',
          borderBottom: '1px #5c5c5c solid',
        }}
      >
        <div
          style={{ fontFamily: 'roboto, sans-serif' }}
          id="repBtn"
          onClick={() => setRepDisplay(true)}
        >
          Report {name}
        </div>
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
            <div
              onClick={() => setRepDisplay(false)}
              style={{ width: '50%', textAlign: 'center' }}
            >
              Cancel
            </div>
            <div
              style={{
                width: '50%',
                textAlign: 'center',
                borderLeft: '1px #5c5c5c solid',
              }}
              onClick={async () => {
                if (!userID || !props.companion.id) return;
                const toUpdate = reportText === '' ? null : reportText;
                await database
                  .ref(`reports/${props.companion.id}/${userID}`)
                  .set(toUpdate);
                onReportPosted(reportText);
              }}
            >
              Submit
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: '80px' }}></div>
      {buttons}
      {alertDiv}
    </Paper>
  );
}
