import './App.css';
import React from 'react';
import { observer } from 'mobx-react';

import TopBar from './top-bar';
import AncherMenu from './ancher-menu';
import BottomPlanList from './bottom-plan-list';
import Map from './map';

function App() {
  return (
    <div className="App">
      <TopBar />
      <AncherMenu />
      <BottomPlanList />
      <Map />
    </div>
  );
}

export default observer(App);
