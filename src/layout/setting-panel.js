import React from 'react';

import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';
import { useUserDatabase } from '../hooks/use-database';

import {
  Grow,
  IconButton,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

export default observer(function SettingPanel() {
  const { openSettingPanel, setOpenSettingPanel, userID } = useStore();
  const {
    showCircle,
    showRadar,
    radarRadius,
    setShowCircle,
    setShowRadar,
    setRadarRadius,
  } = useStore((it) => it.mapStore);
  const [, , updateSetting] = useUserDatabase(userID, 'setting');
  const theme = useTheme();

  return (
    <Grow in={openSettingPanel} mountOnEnter unmountOnExit>
      <Card
        style={{
          position: 'absolute',
          width: '80vmin',
          top: 5,
          left: 5,
          borderWidth: 3,
          borderStyle: 'solid',
          borderColor: theme.palette.primary.main,
          zIndex: 5,
        }}
      >
        <IconButton
          size="small"
          onClick={() => {
            setOpenSettingPanel(false);
            updateSetting({
              radar: showRadar,
              circle: showCircle,
              radius: radarRadius,
            });
          }}
          style={{ position: 'absolute', top: 5, right: 5 }}
        >
          <CloseIcon />
        </IconButton>
        <CardContent style={{ display: 'flex' }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showCircle}
                  onChange={(e) => setShowCircle(e.target.checked)}
                  name="showCircle"
                />
              }
              label="Show Red Crime Hotspots"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showRadar}
                  onChange={(e) => setShowRadar(e.target.checked)}
                  name="showRadar"
                />
              }
              label="Enable Hotspot Radar and Notifications"
            />
            <FormControlLabel
              control={
                <Slider
                  value={typeof radarRadius === 'number' ? radarRadius : 1}
                  onChange={(e, v) => setRadarRadius(v)}
                  min={0.1}
                  max={5}
                  step={0.1}
                  valueLabelDisplay="auto"
                />
              }
              label="Radar Radius"
            />
          </FormGroup>
        </CardContent>
      </Card>
    </Grow>
  );
});
