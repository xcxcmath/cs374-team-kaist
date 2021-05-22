import './App.css';
import React from 'react';
import { observer } from 'mobx-react';

import Radar from './radar';
import BottomPlanList from './bottom-plan-list';
import Map from './map';
import ScreenBorder from './screen-border';
import BottomButtonList from './bottom-button-list';
import UpdateProfile from './updateProfile';
import Login from './login';
import SettingPanel from './setting-panel';
import CompanionPanel from './companion-panel';

import useStore from '../hooks/use-store';

function App() {
  const { mode } = useStore();

  return (
    <div className="App">
      <ScreenBorder />
      <Login />
      {(mode === 'profile' || mode === 'login-profile') && (
        <UpdateProfile
          title={mode === 'profile' ? 'Update Profile' : 'Sign up'}
          disableGoBack={mode === 'login-profile'}
        />
      )}
      <SettingPanel />
      <CompanionPanel />
      <Map>
        <Radar />
        <BottomPlanList />
      </Map>
      <BottomButtonList />
    </div>
  );
}

export default observer(App);
