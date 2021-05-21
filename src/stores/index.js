import { createContext } from 'react';
import { makeAutoObservable } from 'mobx';

import MapStore from './map-store';

/**
 * App modes:
 *
 * login
 * profile
 * main
 * plan
 * list-request
 * see-request
 * post-request
 * see-respond
 * post-report
 */

class RootStore {
  mapStore = null;

  flickerSwitch = true;
  mode = process.env.REACT_APP_PRELOGIN ? 'main' : 'login';
  userID = process.env.REACT_APP_PRELOGIN ?? 'admin';

  constructor({ viewport }) {
    makeAutoObservable(this);
    this.setMode = this.setMode.bind(this);
    this.setUserID = this.setUserID.bind(this);
    this.mapStore = new MapStore(viewport);

    setInterval(() => this.toggleFlickerSwitch(), 1000);
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
