import React from 'react';

import { Fab } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';

export default observer(function BottomButtonList() {
  const { setMode } = useStore();

  return (
    <div
      style={{
        position: 'absolute',
        right: 5,
        top: 10,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Fab size="small" onClick={() => setMode('profile')}>
        <AccountCircleIcon />
      </Fab>
      <Fab size="small">
        <TuneIcon />
      </Fab>
    </div>
  );
});
