import { makeAutoObservable } from 'mobx';

const crimeData = [
  {
    coordinates: [126.9767, 37.575],
    category: 'Category 1',
    id: '1',
    degree: 3,
    description: '2 events per day',
  },
  {
    coordinates: [126.976, 37.584],
    category: 'Category 2',
    id: '2',
    degree: 1,
    description: '100 events per day',
  },
];

export default class MapStore {
  viewport = null;
  accessToken = process.env.REACT_APP_MAPBOX_KEY;
  currentPlan = null;
  crimeData = crimeData;

  constructor(viewport) {
    makeAutoObservable(this);
    this.setViewport = this.setViewport.bind(this);
    this.setCurrentPlan = this.setCurrentPlan.bind(this);
    this.setCrimeData = this.setCrimeData.bind(this);

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
}
