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
  firebaseStore = null;

  flickerSwitch = true;
  mode = 'main';
  ancherMenuOpen = false;

  constructor({ viewport }) {
    makeAutoObservable(this);
    this.setMode = this.setMode.bind(this);
    this.setAncherMenuOpen = this.setAncherMenuOpen.bind(this);
    this.setNotifications = this.setNotifications.bind(this);

    this.mapStore = new MapStore(viewport);

    setInterval(() => this.toggleFlickerSwitch(), 1000);
  }

  toggleFlickerSwitch() {
    this.flickerSwitch = !this.flickerSwitch;
  }

  setMode(mode) {
    this.mode = mode;
  }
  setNotifications(notifications) {
    this.notifications = notifications;
  }
  setAncherMenuOpen(open) {
    this.ancherMenuOpen = open;
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
