import { createContext } from 'react';
import { makeAutoObservable } from 'mobx';

import MapStore from './map-store';
import { database } from './firebase';

/**
 * App modes:
 *
 * login
 * profile, login-profile
 * main
 * plan
 *
 * list-request
 * see-request
 * post-request
 * see-respond
 * post-report
 */

export const initialUserData = {
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
};

class RootStore {
  mapStore = null;

  flickerSwitch = true;
  mode = process.env.REACT_APP_PRELOGIN ? 'main' : 'login';
  userID = process.env.REACT_APP_PRELOGIN ?? 'admin';
  openSettingPanel = false;
  openCompanionPanel = false;
  openSnackBar = false;
  snackBarMessage = '';
  snackBarDuration = 5000;
  openDialog = false;
  dialog = null;
  openIntro = false;

  constructor({ viewport }) {
    makeAutoObservable(this);
    this.setMode = this.setMode.bind(this);
    this.setUserID = this.setUserID.bind(this);
    this.setOpenSettingPanel = this.setOpenSettingPanel.bind(this);
    this.setOpenCompanionPanel = this.setOpenCompanionPanel.bind(this);
    this.setSnackBarMessage = this.setSnackBarMessage.bind(this);
    this.closeSnackBar = this.closeSnackBar.bind(this);
    this.setDialog = this.setDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.setOpenIntro = this.setOpenIntro.bind(this);
    this.mapStore = new MapStore(viewport);

    setInterval(() => this.toggleFlickerSwitch(), 1000);

    if (process.env.REACT_APP_PRELOGIN) {
      database
        .ref(`users/${process.env.REACT_APP_PRELOGIN}`)
        .get()
        .then((it) => {
          if (it.val()) {
            this.mapStore.injectMapSettings(it.val().setting);
          } else {
            database
              .ref(`users/${process.env.REACT_APP_PRELOGIN}`)
              .set(initialUserData)
              .then(() => {
                this.mapStore.injectMapSettings(initialUserData.setting);
              });
          }
        });
    }
  }

  toggleFlickerSwitch() {
    this.flickerSwitch = !this.flickerSwitch;
  }

  setMode(mode) {
    this.mode = mode;
  }

  setUserID(id) {
    this.userID = id;
  }

  setOpenSettingPanel(open) {
    this.openSettingPanel = open;
  }

  setOpenCompanionPanel(open) {
    this.openCompanionPanel = open;
  }
  setSnackBarMessage(message) {
    this.snackBarMessage = message;
    if (message) {
      this.openSnackBar = true;
    }
  }
  closeSnackBar() {
    this.openSnackBar = false;
  }

  setDialog(title, text, onNo, onYes) {
    this.dialog = { title, text, onNo, onYes };
    this.openDialog = true;
  }
  closeDialog() {
    this.dialog = null;
    this.openDialog = false;
  }

  setOpenIntro(open) {
    this.openIntro = open;
  }
}

const rootStore = createContext(
  new RootStore({
    viewport: {
      longitude: 126.9765,
      latitude: 37.5837,
      zoom: 15,
      pitch: 0,
      bearing: 0,
    },
  })
);

export default rootStore;
