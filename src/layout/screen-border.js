import React from 'react';

import useStore from '../hooks/use-store';
import { observer } from 'mobx-react';

import { useTheme } from '@material-ui/core/styles';

export default observer(function ScreenBorder() {
  const theme = useTheme();
  const border = '1px solid red';
  return (
    <div
      style={{
        zIndex: -10,
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        boxSizing: 'border-box',
        border,
        transition: 'border 0.3s',
      }}
    />
  );
});
