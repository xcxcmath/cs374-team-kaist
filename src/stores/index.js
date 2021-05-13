import { createContext } from 'react';
import { makeAutoObservable } from 'mobx';

import MapStore from './map-store';

class RootStore {
  mapStore = null;
  firebaseStore = null;

  mode = 'main'; // 'main', 'plan', etc..
  ancherMenuOpen = false;

  constructor({ viewport }) {
    makeAutoObservable(this);
    this.setMode = this.setMode.bind(this);
    this.setAncherMenuOpen = this.setAncherMenuOpen.bind(this);

    this.mapStore = new MapStore(viewport);
  }

  setMode(mode) {
    this.mode = mode;
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
