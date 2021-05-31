import React from 'react';

import { Fab } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';

export default observer(function BottomButtonList() {
  const { setMode, setOpenSettingPanel } = useStore();

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
      <Fab
        size="small"
        onClick={() => setMode('profile')}
        aria-label="Update Profile"
      >
        <AccountCircleIcon />
      </Fab>
      <Fab
        size="small"
        onClick={() => setOpenSettingPanel(true)}
        aria-label="Settings"
      >
        <TuneIcon />
      </Fab>
    </div>
  );
});
