import React from 'react';

import { Fab } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HelpIcon from '@material-ui/icons/Help';

import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';

export default observer(function BottomButtonList() {
  const { setMode, setOpenSettingPanel, setOpenIntro } = useStore();

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
      <Fab
        size="small"
        onClick={() => {
          setOpenIntro(true);
        }}
        aria-label="Help"
      >
        <HelpIcon />
      </Fab>
    </div>
  );
});
