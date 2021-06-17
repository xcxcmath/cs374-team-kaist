import './App.css';
import React from 'react';
import { observer } from 'mobx-react';
import {
  Snackbar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import Radar from './radar';
import BottomPlanList from './bottom-plan-list';
import Map from './map';
import ScreenBorder from './screen-border';
import BottomButtonList from './bottom-button-list';
import UpdateProfile from './updateProfile';
import Login from './login';
import SettingPanel from './setting-panel';
import CompanionPanel from './companion-panel';
import Intro from './intro';

import useStore from '../hooks/use-store';

function App() {
  const {
    mode,
    openSnackBar,
    closeSnackBar,
    snackBarDuration,
    snackBarMessage,
    dialog,
    openDialog,
    closeDialog,
  } = useStore();

  return (
    <div className="App">
      <ScreenBorder />
      <Login />
      {(mode === 'profile' || mode === 'login-profile') && (
        <UpdateProfile
          title={mode === 'profile' ? 'Update Profile' : 'Sign up'}
          disableGoBack={mode === 'login-profile'}
        />
      )}
      <SettingPanel />
      <CompanionPanel />
      <Map>
        <Radar />
        <BottomPlanList />
      </Map>
      <BottomButtonList />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackBar}
        autoHideDuration={snackBarDuration}
        onClose={closeSnackBar}
        message={snackBarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={closeSnackBar}
            aria-label="Close Snackbar"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Intro />
      <Dialog open={openDialog} onClose={closeDialog} style={{ zIndex: 20 }}>
        {dialog?.title && <DialogTitle>{dialog.title}</DialogTitle>}
        <DialogContent>
          <DialogContentText>{dialog?.text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {dialog?.onNo && (
            <Button
              onClick={() => {
                dialog.onNo();
                closeDialog();
              }}
              autoFocus
              aria-label="Cancel plan deletion"
            >
              No
            </Button>
          )}
          {dialog?.onYes && (
            <Button
              onClick={() => {
                dialog.onYes();
                closeDialog();
              }}
              color="secondary"
              aria-label="Delete plan"
            >
              Yes
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default observer(App);
