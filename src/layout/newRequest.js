import React, { useState } from 'react';
import { TextField, Button, Paper } from '@material-ui/core';
import RequestAlert from './../components/requestAlert';

const now = () => {
  const d = new Date(Date.now());
  const zf2 = (n) => (n >= 10 ? `${n}` : `0${n}`);
  return `${d.getFullYear()}-${zf2(d.getMonth() + 1)}-${zf2(d.getDate())}T${zf2(
    d.getHours()
  )}:${zf2(d.getMinutes())}`;
};

export default function NewRequest({ onCreate, onCancel }) {
  const [travelText, setTravelText] = useState('');
  const [visitText, setVisitText] = useState('');
  const [time, setTime] = useState(now());

  return (
    <Paper
      elevation={3}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: 10,
        overflow: 'scroll',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '35px',
          textAlign: 'center',
          borderBottom: '2px #5c5c5c solid',
          fontFamily: 'roboto, sans-serif',
          fontSize: '20px',
          justifyContent: 'center',
          color: 'black',
        }}
      >
        New request
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '92%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '5px',
        }}
      >
        <TextField
          fullWidth
          id="travelText"
          label="About path"
          placeholder="Explain why you chose the path"
          multiline
          rows={3}
          value={travelText}
          onChange={(e) => setTravelText(e.target.value)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '92%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '5px',
        }}
      >
        <TextField
          fullWidth
          id="visitText"
          label="About visit"
          placeholder="Explain why you are visiting the city"
          multiline
          rows={3}
          value={visitText}
          onChange={(e) => setVisitText(e.target.value)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '92%',
          marginTop: '10px',
          justifyContent: 'center',
        }}
      >
        Departure time
        <TextField
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'space-evenly', margin: 10 }}
      >
        <Button
          color="secondary"
          variant="contained"
          onClick={() => onCancel()}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => onCreate(travelText, visitText, time)}
        >
          Create request
        </Button>
      </div>
    </Paper>
  );
}
