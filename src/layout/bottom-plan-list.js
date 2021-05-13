import React from 'react';
import Fab from '@material-ui/core/Fab';

import AddIcon from '@material-ui/icons/Add';

import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';

export default observer(function BottomPlanList() {
  const { mode, setMode } = useStore();

  if (mode === 'plan') {
  }

  if (mode !== 'main') {
    return <></>;
  }

  return (
    <div
      className="plan-list"
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        zIndex: 1,
      }}
    >
      <Fab
        color="primary"
        variant="extended"
        onClick={() => {
          setMode('plan');
        }}
      >
        <AddIcon />
        Walking Plan
      </Fab>
    </div>
  );
});
