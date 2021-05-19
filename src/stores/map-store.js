import { makeAutoObservable } from 'mobx';

const crimeData = [
  {
    coordinates: [126.9767, 37.575],
    category: 'Theft',
    id: '1',
    degree: 3,
    description: '100 event per day',
  },
  {
    coordinates: [126.976, 37.584],
    category: 'Theft',
    id: '2',
    degree: 1,
    description: '2 events per day',
  },
];

export default class MapStore {
  viewport = null;
  accessToken = process.env.REACT_APP_MAPBOX_KEY;
  currentPlan = null;
  crimeData = crimeData;
  crimePopups = [];
  userCoords = null;

  constructor(viewport) {
    makeAutoObservable(this);
    this.setViewport = this.setViewport.bind(this);
    this.setCurrentPlan = this.setCurrentPlan.bind(this);
    this.setCrimeData = this.setCrimeData.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.setUserCoords = this.setUserCoords.bind(this);

    this.viewport = viewport;
  }

  setViewport(viewport) {
    this.viewport = viewport;
  }

  setCurrentPlan(plan) {
    this.currentPlan = plan;
  }

  setCrimeData(data) {
    this.crimeData = data;
  }

  showPopup(id) {
    const crime = this.crimeData.find((it) => it.id === id);
    if (!crime) return;
    if (this.crimePopups.findIndex((it) => it.id === id) !== -1) return;
    this.crimePopups.push(crime);
  }

  closePopup(id) {
    this.crimePopups = this.crimePopups.filter((it) => it.id !== id);
  }

  setUserCoords(coords) {
    this.userCoords = coords;
  }
}
