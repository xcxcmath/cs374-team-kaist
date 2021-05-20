import './App.css';
import React from 'react';
import { observer } from 'mobx-react';

import Radar from './radar';
import BottomPlanList from './bottom-plan-list';
import Map from './map';
import ScreenBorder from './screen-border';
import BottomButtonList from './bottom-button-list';

function App() {
  return (
    <div className="App">
      <ScreenBorder />
      <Map>
        <Radar />
        <BottomPlanList />
      </Map>
      <BottomButtonList />
    </div>
  );
}

export default observer(App);
