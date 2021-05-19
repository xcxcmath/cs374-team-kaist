import './App.css';
import React from 'react';
import { observer } from 'mobx-react';

import Radar from './radar';
import BottomPlanList from './bottom-plan-list';
import Map from './map';
import ScreenBorder from './screen-border';

function App() {
  return (
    <div className="App">
      <ScreenBorder />
      <Map>
        <Radar />
        <BottomPlanList />
      </Map>
    </div>
  );
}

export default observer(App);
