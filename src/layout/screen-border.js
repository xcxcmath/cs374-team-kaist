import React from 'react';

import useStore from '../hooks/use-store';
import { observer } from 'mobx-react';

import { useTheme } from '@material-ui/core/styles';

export default observer(function ScreenBorder() {
  const { crimeNear } = useStore((it) => it.mapStore);
  const theme = useTheme();
  const borderWidth = crimeNear.length > 0 ? 5 : 0;
  const borderStyle = 'solid';
  const borderColor = theme.palette.error.main;
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        boxSizing: 'border-box',
        borderWidth,
        borderStyle,
        borderColor,
        transition: 'border 0.3s',
        pointerEvents: 'none',
      }}
    />
  );
});
