import { makeAutoObservable } from 'mobx';

const crimeData = [
  {
    coordinates: [126.9767, 37.575],
    category: '',
    id: '1',
    degree: 3,
  },
  {
    coordinates: [126.976, 37.584],
    category: '',
    id: '2',
    degree: 1,
  },
];

export default class MapStore {
  viewport = null;
  accessToken = process.env.REACT_APP_MAPBOX_KEY;
  planList = [];
  focusedPlanId = null;
  crimeData = crimeData;

  constructor(viewport) {
    makeAutoObservable(this);
    this.setViewport = this.setViewport.bind(this);
    this.getFocusedPlan = this.getFocusedPlan.bind(this);
    this.focusPlan = this.focusPlan.bind(this);
    this.unfocusPlan = this.unfocusPlan.bind(this);
    this.setPlanList = this.setPlanList.bind(this);
    this.addCrimeData = this.addCrimeData.bind(this);

    this.viewport = viewport;
  }

  setViewport(viewport) {
    this.viewport = viewport;
  }

  getFocusedPlan() {
    return this.planLines[this.focusedPlanId];
  }

  focusPlan(id) {
    this.focusedPlanId = id;
  }

  unfocusPlan() {
    this.focusedPlanId = null;
  }

  setPlanList(list) {
    this.planList = list;
  }

  addCrimeData(data) {
    this.crimeData.push(data);
  }
}
