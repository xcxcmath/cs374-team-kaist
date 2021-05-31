import { makeAutoObservable } from 'mobx';
import * as turf from '@turf/turf/dist/js';
import { database } from './firebase';

/*const crimeData = [
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
    coordinates: [127.4275, 36.71],
    category: 'Violence',
    id: '3',
    degree: 2,
    description: '8 events per day',
  },
  {
    coordinates: [127.36236, 36.36873],
    category: "Geese's Theft",
    id: '4',
    degree: 2,
    description: '2 events per day',
  },
];*/

export default class MapStore {
  viewport = null;
  accessToken = process.env.REACT_APP_MAPBOX_KEY;
  otherPlan = null;
  isOtherPlanValid = false;
  crimeData = [];
  crimeCircles = { type: 'FeatureCollection', features: [] };
  crimePopups = [];
  crimeNear = [];
  userCoords = null;
  showCircle = true;
  showRadar = false;
  radarRadius = 1;

  constructor(viewport) {
    makeAutoObservable(this);
    this.setViewport = this.setViewport.bind(this);
    this.setOtherPlan = this.setOtherPlan.bind(this);
    this.setIsOtherPlanValid = this.setIsOtherPlanValid.bind(this);
    this.setCrimeData = this.setCrimeData.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.addNear = this.addNear.bind(this);
    this.removeNear = this.removeNear.bind(this);
    this.clearNear = this.clearNear.bind(this);
    this.setUserCoords = this.setUserCoords.bind(this);
    this.setShowCircle = this.setShowCircle.bind(this);
    this.setShowRadar = this.setShowRadar.bind(this);
    this.setRadarRadius = this.setRadarRadius.bind(this);
    this.injectMapSettings = this.injectMapSettings.bind(this);

    this.viewport = viewport;
    this.updateCrimeCircles();

    database.ref('crimes/').on('value', (snapshot) => {
      const obj = snapshot.val() ?? {};
      const arr = Object.entries(obj).map(([id, val]) => {
        const { lng, lat, category, degree, description } = val;
        return { coordinates: [lng, lat], id, degree, description, category };
      });
      this.setCrimeData(arr);
    });
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

  addNear(id, onAdded) {
    const crime = this.crimeData.find((it) => it.id === id);
    if (!crime) return;
    if (this.crimeNear.findIndex((it) => it === id) !== -1) return;
    this.crimeNear.push(id);
    this.showPopup(id);
    onAdded();
  }

  removeNear(id) {
    this.crimeNear = this.crimeNear.filter((it) => it !== id);
  }

  clearNear() {
    this.crimeNear = [];
  }

  setUserCoords(coords) {
    this.userCoords = coords;
  }

  setShowCircle(show) {
    this.showCircle = show;
  }

  setShowRadar(show) {
    this.showRadar = show;
  }

  setRadarRadius(radius) {
    this.radarRadius = radius;
  }

  injectMapSettings(settings) {
    const keys = Object.keys(settings);
    if (keys.includes('radar') && typeof settings.radar === 'boolean') {
      this.showRadar = settings.radar;
    }

    if (keys.includes('circle') && typeof settings.circle === 'boolean') {
      this.showCircle = settings.circle;
    }
    if (keys.includes('radius') && typeof settings.radius === 'number') {
      this.radarRadius = settings.radius;
    }
  }
}
