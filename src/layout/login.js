import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import {
  TextField,
  Button,
  Paper,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';

import useStore from '../hooks/use-store';
import { database } from '../stores/firebase';

export default observer(function Login() {
  const { mode, setMode, setUserID } = useStore();
  const [loading, setLoading] = useState(false);
  const ref = useMemo(() => database.ref('users'), []);

  const [id, setIdInput] = useState('');

  return mode === 'login' ? (
    <>
      <Backdrop open={loading} style={{ zIndex: 11 }}>
        <CircularProgress />
      </Backdrop>
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
          Login
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
            id="user-id"
            label="ID"
            value={id}
            onChange={(e) => setIdInput(e.target.value)}
          />
        </div>
        <Button
          style={{ margin: 30 }}
          disabled={loading}
          color="primary"
          variant="outlined"
          onClick={async () => {
            if (id.length <= 20 && /^[A-Za-z0-9]+$/.test(id)) {
              setLoading(true);
              const userData = (await ref.child(id).get()).val();
              if (userData) {
                setUserID(id);
                setLoading(false);
                setMode('main');
              } else {
                await ref.child(id).set({
                  name: '',
                  age: 19,
                  gender: 'other',
                  country: 'KR',
                  bio: '',
                  phone: '',
                  kakao: '',
                  setting: {
                    circle: true,
                    radar: false,
                    radius: 1,
                  },
                });

                setUserID(id);
                setLoading(false);
                setMode('login-profile');
              }
            }
          }}
        >
          Log in!
        </Button>
      </Paper>
    </>
  ) : (
    <></>
  );
});
