import React from 'react';
import Fab from '@material-ui/core/Fab';

import { List } from '@material-ui/core';
//import SwipeableListItem from 'mui-swipeable-list-item';
import SwipeableListItem from '../components/swipeable-list-item';
import DirectionsIcon from '@material-ui/icons/Directions';

import { action } from 'mobx';
import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';

export default observer(function BottomPlanList() {
  const { mode, setMode } = useStore();
  const { currentPlan, setCurrentPlan } = useStore((it) => it.mapStore);

  if (mode !== 'main') {
    return <></>;
  }

  const inside =
    currentPlan === null ? (
      <Fab
        color="primary"
        variant="extended"
        onClick={action(() => {
          setMode('plan');
        })}
      >
        <DirectionsIcon />
        Find Safe Path
      </Fab>
    ) : (
      <List>
        <SwipeableListItem
          background={{
            actionIconLeft: 'Delete',
            actionIconRight: 'Companion',
            backgroundColorLeft: '#f22',
            backgroundColorRight: '#333',
          }}
          onSwipedLeft={() => {
            setCurrentPlan(null);
          }}
          onSwipedRight={() => {
            // TODO : Companion
          }}
          List
          primaryText={currentPlan.origin.place_name}
          secondaryText={currentPlan.destination.place_name}
        ></SwipeableListItem>
      </List>
    );

  return (
    <div
      className="plan-list"
      style={{
        position: 'absolute',
        left: 0,
        bottom: 10,
        width: '100%',
        zIndex: 1,
      }}
    >
      {inside}
    </div>
  );
});
