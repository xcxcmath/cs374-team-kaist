import React from 'react';

import useStore from '../hooks/use-store';
import { observer } from 'mobx-react';

import { useTheme } from '@material-ui/core/styles';

export default observer(function ScreenBorder() {
  const { crimeNear } = useStore((it) => it.mapStore);
  const theme = useTheme();
  const borderWidth = crimeNear.length > 0 ? 2 : 0;
  const borderStyle = 'solid';
  const borderColor = theme.palette.error.main;
  const boxShadow = `inset 0 0 ${crimeNear.length > 0 ? '5px 2px' : '0 0'} ${
    theme.palette.error.main
  }`;
  return (
    <div
      id="screen-border"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        boxSizing: 'border-box',
        borderWidth,
        borderStyle,
        borderColor,
        boxShadow,
        transition:
          'border-width 0.3s, border-style 0.3s, border-color 0.3s, box-shadow 0.3s',
        pointerEvents: 'none',
      }}
    />
  );
});
