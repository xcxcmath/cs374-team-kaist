import './App.css';
import React from 'react';
import { observer } from 'mobx-react';

import TopBar from './top-bar';
import AncherMenu from './ancher-menu';
import BottomPlanList from './bottom-plan-list';
import Map from './map';
import GradientDiscreteSlider from '../GradientDiscreteSlider';
import GradientContinuousSlider from '../GradientContinuousSlider';

function App() {
  return (
    <div className="App">
      <TopBar />
      <AncherMenu />
      <GradientDiscreteSlider />
      <GradientContinuousSlider />
      <BottomPlanList />
      <Map />
    </div>
  );
}

export default observer(App);
