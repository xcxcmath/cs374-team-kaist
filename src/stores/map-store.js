import { makeAutoObservable } from 'mobx';
import * as turf from '@turf/turf/dist/js';

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
  {
    coordinates: [127.43, 36.7034],
    category: 'Violence',
    id: '3',
    degree: 2,
    description: '8 events per day',
  },
];

export default class MapStore {
  viewport = null;
  accessToken = process.env.REACT_APP_MAPBOX_KEY;
  currentPlan = null;
  otherPlan = null;
  isOtherPlanValid = false;
  crimeData = crimeData;
  crimeCircles = { type: 'FeatureCollection', features: [] };
  crimePopups = [];
  userCoords = null;
  radarRadius = 1;

  constructor(viewport) {
    makeAutoObservable(this);
    this.setViewport = this.setViewport.bind(this);
    this.setCurrentPlan = this.setCurrentPlan.bind(this);
    this.setOtherPlan = this.setOtherPlan.bind(this);
    this.setIsOtherPlanValid = this.setIsOtherPlanValid.bind(this);
    this.setCrimeData = this.setCrimeData.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.setUserCoords = this.setUserCoords.bind(this);
    this.setRadarRadius = this.setRadarRadius.bind(this);

    this.viewport = viewport;
    this.updateCrimeCircles();
  }

  updateCrimeCircles() {
    const allFeatures = this.crimeData.map(
      ({ coordinates, category, id, degree, description }) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [...coordinates] },
        properties: {
          category,
          id,
          degree,
          description,
          longitude: coordinates[0],
          latitude: coordinates[1],
        },
      })
    );
    this.crimeCircles = turf.buffer(
      { type: 'FeatureCollection', features: allFeatures },
      0.25,
      {
        units: 'kilometers',
      }
    );
  }

  setViewport(viewport) {
    this.viewport = viewport;
  }

  setCurrentPlan(plan) {
    this.currentPlan = plan;
  }

  setOtherPlan(plan) {
    this.otherPlan = plan;
    if (!plan) {
      this.isOtherPlanValid = false;
    }
  }

  setIsOtherPlanValid(valid) {
    this.isOtherPlanValid = valid;
  }

  setCrimeData(data) {
    this.crimeData = data;
    this.updateCrimeCircles();
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

  setRadarRadius(radius) {
    this.radarRadius = radius;
  }
}
