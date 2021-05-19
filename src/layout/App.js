import './App.css';
import React from 'react';
import { observer } from 'mobx-react';

import BottomPlanList from './bottom-plan-list';
import Map from './map';

function App() {
  return (
    <div className="App">
      <Map>
        <BottomPlanList />
      </Map>
    </div>
  );
}

export default observer(App);
