import { createContext } from 'react';
import { makeAutoObservable, action } from 'mobx';

import utils from '../utils/directions';
import * as turf from '@turf/turf/dist/js';
import polyline from '@mapbox/polyline';

const request = new XMLHttpRequest();

class MapDirectionsStore {
  accessToken = '';
  api = 'https://api.mapbox.com/directions/v5/';
  profile = 'mapbox/walking';
  alternatives = false;
  congestion = false;
  unit = 'metric';
  flyTo = true;
  placeholderOrigin = 'Choose a starting place';
  placeholderDestination = 'Choose destination';
  zoom = 16;
  language = 'en';
  compile = null;
  proximity = false;
  styles = [];

  geometries = 'geojson';
  controls = { profileSwitcher: false, inputs: true, instructions: false };
  geocoder = {};
  interactive = true;

  // Container for client registered events
  events = {};

  // Marker feature drawn on the map at any point
  origin = {};
  destination = {};
  waypoints = [];

  // User input strings or result returned from geocoder
  originQuery = null;
  destinationQuery = null;
  originQueryCoordinates = null;
  destinationQueryCoordinates = null;

  // Directions data
  directions = [];
  routePadding = 60;

  error = null;

  // maximum degree
  maximumDegree = 3;
  isValidRoute = false;
  trial = 0;

  constructor(accessToken) {
    makeAutoObservable(this);
    this.initialize = this.initialize.bind(this);
    this.fetchDirectionsIfPossible = this.fetchDirectionsIfPossible.bind(this);
    this.canFetch = this.canFetch.bind(this);
    this.originPoint = this.originPoint.bind(this);
    this.destinationPoint = this.destinationPoint.bind(this);
    this.setDirections = this.setDirections.bind(this);
    this.updateWaypoints = this.updateWaypoints.bind(this);
    this.fetchDirections = this.fetchDirections.bind(this);
    this.setError = this.setError.bind(this);

    this.queryOrigin = this.queryOrigin.bind(this);
    this.queryDestination = this.queryDestination.bind(this);
    this.queryOriginCoordinates = this.queryOriginCoordinates.bind(this);
    this.queryDestinationCoordinates =
      this.queryDestinationCoordinates.bind(this);
    this.clearOrigin = this.clearOrigin.bind(this);
    this.clearDestination = this.clearDestination.bind(this);
    this.createOrigin = this.createOrigin.bind(this);
    this.createDestination = this.createDestination.bind(this);
    this.reverse = this.reverse.bind(this);
    this.setOriginFromCoordinates = this.setOriginFromCoordinates.bind(this);
    this.setDestinationFromCoordinates =
      this.setDestinationFromCoordinates.bind(this);
    this.addWaypoint = this.addWaypoint.bind(this);
    this.setWaypoint = this.setWaypoint.bind(this);
    this.eventSubscribe = this.eventSubscribe.bind(this);
    this.eventUnsubscribe = this.eventUnsubscribe.bind(this);
    this.eventEmit = this.eventEmit.bind(this);

    this.accessToken = accessToken;
  }

  initialize() {
    this.origin = {};
    this.destination = {};
    this.waypoints = [];
    this.events = {};
    this.directions = [];
  }

  fetchSafeDirections(circles, onSuccess, onFail, maximumTrial) {
    if (!this.canFetch()) return;
    if (this.events['route'] && this.events['route'].length) {
      this.events['route'] = [];
    }
    const targetCircles = {
      type: 'FeatureCollection',
      features: [
        ...(this.maximumDegree < 1 ? circles[0].features : []),
        ...(this.maximumDegree < 2 ? circles[1].features : []),
        ...(this.maximumDegree < 3 ? circles[2].features : []),
      ],
    };
    this.trial = 0;
    this.isValidRoute = false;
    const onRoute = ({ route }) => {
      route.forEach((e) => {
        if (this.trial > maximumTrial) {
          onFail();
          this.eventUnsubscribe('route', onRoute);
          return;
        }
        console.log(this.trial);
        const routeLine = polyline.toGeoJSON(e.geometry);
        const bbox = turf.bbox(routeLine);
        const polygon = turf.bboxPolygon(bbox);

        if (turf.booleanDisjoint(targetCircles, routeLine)) {
          onSuccess({ route: route[0] });
          this.isValidRoute = true;
          this.eventUnsubscribe('route', onRoute);
        } else {
          ++this.trial;
          const polygon2 = turf.transformScale(
            polygon,
            (this.trial + 1) * 0.075 + 0.5
          );
          const bbox2 = turf.bbox(polygon2);
          const randomWaypoint = turf.randomPoint(1, { bbox: bbox2 });
          this.setWaypoint(0, randomWaypoint['features'][0]);
          this.fetchDirections();
        }
      });
    };
    if (this.waypoints.length > 0) {
      this.waypoints = [];
    }
    this.eventSubscribe('route', action(onRoute));
    this.fetchDirections();
  }

  fetchDirectionsIfPossible() {
    if (this.canFetch()) {
      this.fetchDirections();
    }
  }
  canFetch() {
    return this.origin.geometry && this.destination.geometry;
  }

  // actions

  originPoint(coordinates) {
    const origin = utils.createPoint(coordinates, {
      id: 'origin',
      'marker-symbol': 'A',
    });
    this._Origin(origin);
    this.eventEmit('origin', { feature: origin });
  }
  destinationPoint(coordinates) {
    const destination = utils.createPoint(coordinates, {
      id: 'destination',
      'marker-symbol': 'B',
    });
    this._Destination(destination);
    this.eventEmit('destination', { feature: destination });
  }
  setMaximumDegree(degree) {
    this.maximumDegree = degree;
  }
  setDirections(directions) {
    this._Directions(directions);
    if (directions.length) this.eventEmit('route', { route: directions });
  }
  updateWaypoints(waypoints) {
    this._Waypoints(waypoints);
  }
  fetchDirections() {
    if (!(this.destination && this.destination.geometry)) return;
    const query = this.buildDirectionsQuery();

    const { language, accessToken, api, profile } = this;

    const options = [];
    options.push('geometries=polyline');
    options.push('steps=true');
    options.push('overview=full');
    if (language) options.push('language=' + language);
    if (accessToken) options.push('access_token=' + accessToken);
    request.abort();
    request.open(
      'GET',
      `${api}${profile}/${query}.json?${options.join('&')}`,
      true
    );

    request.onload = action(() => {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        if (data.error) {
          this.setDirections([]);
          this.setError(data.error);
          return;
        }

        this.setError(null);
        this.setDirections(data.routes);

        // Revise origin / destination points

        this.originPoint(data.waypoints[0].location);
        this.destinationPoint(
          data.waypoints[data.waypoints.length - 1].location
        );
      } else {
        this.setDirections([]);
        this.setError(JSON.parse(request.responseText).message);
      }
    });

    request.onerror = action(() => {
      this.setDirections([]);
      //this.setError(JSON.parse(request.responseText).message);
      this.setError('what?');
    });

    request.send();
  }

  setError(error) {
    this._Error(error);
    if (error) this.eventEmit('error', { error });
  }

  // helpers

  buildDirectionsQuery() {
    const query = [...this.origin.geometry.coordinates.join(','), ';'];
    console.log(this.waypoints);
    if (this.waypoints.length) {
      this.waypoints.forEach((waypoint) => {
        query.push(waypoint.geometry.coordinates.join(','));
        query.push(';');
      });
    }

    query.push(this.destination.geometry.coordinates.join(','));
    return encodeURIComponent(query.join(''));
  }

  normalizeWaypoint(waypoint) {
    const properties = { id: 'waypoint' };
    return Object.assign(waypoint, {
      properties: waypoint.properties
        ? Object.assign(waypoint.properties, properties)
        : properties,
    });
  }

  // exports

  queryOrigin(query) {
    this._OriginQuery(query);
  }
  queryDestination(query) {
    this._DestinationQuery(query);
  }
  queryOriginCoordinates(coords) {
    this._OriginFromCoordinates(coords);
  }
  queryDestinationCoordinates(coords) {
    this._DestinationFromCoordinates(coords);
  }
  clearOrigin() {
    this._OriginClear();
    this.eventEmit('clear', { type: 'origin' });
    this.setError(null);
  }
  clearDestination() {
    this._DestinationClear();
    this.eventEmit('clear', { type: 'destination' });
    this.setError(null);
  }
  createOrigin(coordinates) {
    this.originPoint(coordinates);
    //if (this.destination.geometry) this.fetchDirections();
  }
  createDestination(coordinates) {
    this.destinationPoint(coordinates);
    //if (this.origin.geometry) this.fetchDirections();
  }
  reverse() {
    const { origin, destination } = this;
    if (destination.geometry)
      this.originPoint(destination.geometry.coordinates);

    if (origin.geometry) this.destinationPoint(origin.geometry.coordinates);
  }
  setOriginFromCoordinates(coords) {
    if (!utils.validCoords(coords))
      coords = [utils.wrap(coords[0]), utils.wrap(coords[1])];
    if (isNaN(coords[0]) && isNaN(coords[1])) {
      // TODO : not OR?
      this.setError(new Error('Coordinates are not valid'));
      return;
    }
    this.queryOriginCoordinates(coords);
    this.createOrigin(coords);
  }
  setDestinationFromCoordinates(coords) {
    if (!utils.validCoords(coords))
      coords = [utils.wrap(coords[0]), utils.wrap(coords[1])];
    if (isNaN(coords[0]) && isNaN(coords[1])) {
      // TODO : not OR?
      this.setError(new Error('Coordinates are not valid'));
      return;
    }
    this.createDestination(coords);
    this.queryDestinationCoordinates(coords);
  }

  addWaypoint(index, waypoint) {
    this.waypoints.splice(index, 0, this.normalizeWaypoint(waypoint));
    // [BeomJu] don't re-fetch yet
  }

  setWaypoint(index, waypoint) {
    this.waypoints[index] = this.normalizeWaypoint(waypoint);
    // [BeomJu] don't re-fetch yet
  }

  eventSubscribe(type, fn) {
    this.events[type] = this.events[type] || [];
    if (this.events[type].findIndex((it) => it === fn) !== -1) return;

    this.events[type].push(fn);
  }

  eventUnsubscribe(type, fn) {
    this.events[type] = this.events[type]?.filter((it) => it !== fn) ?? [];
  }

  eventEmit(type, data) {
    if (!this.events[type]) return;
    const listeners = this.events[type].slice();
    listeners.forEach((it) => it(data));
  }

  // reducers

  _Origin(origin) {
    this.origin = origin;
  }

  _Destination(destination) {
    this.destination = destination;
  }

  _Waypoints(waypoints) {
    this.waypoints = waypoints;
  }

  _OriginQuery(query) {
    this.originQuery = query;
  }
  _DestinationQuery(query) {
    this.destinationQuery = query;
  }

  _OriginFromCoordinates(coordinates) {
    this.originQueryCoordinates = coordinates;
  }
  _DestinationFromCoordinates(coordinates) {
    this.destinationQueryCoordinates = coordinates;
  }

  _OriginClear() {
    this.origin = {};
    this.originQuery = ''; // TODO
    this.waypoints = [];
    this.directions = []; // TODO
  }
  _DestinationClear() {
    this.destination = {};
    this.destinationQuery = '';
    this.waypoints = [];
    this.directions = [];
  }

  _Directions(directions) {
    this.directions = directions;
  }
  _Error(error) {
    this.error = error;
  }
}

export default createContext(
  new MapDirectionsStore(process.env.REACT_APP_MAPBOX_KEY)
);
