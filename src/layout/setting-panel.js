import React from 'react';

import { observer } from 'mobx-react';
import useStore from '../hooks/use-store';
import { useUserDatabase } from '../hooks/use-database';

import {
  Grow,
  IconButton,
  Card,
  CardContent,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import GradientSlider from '../components/gradient-slider';
import DegreeLabel from '../components/degree-label';

export default observer(function SettingPanel() {
  const { openSettingPanel, setOpenSettingPanel, userID, flickerSwitch } =
    useStore();
  const {
    showCircle,
    showRadar,
    radarRadius,
    setShowCircle,
    setShowRadar,
    setRadarRadius,
  } = useStore((it) => it.mapStore);
  const [, , updateSetting] = useUserDatabase(userID, 'setting');

  return (
    <Grow in={openSettingPanel} mountOnEnter unmountOnExit>
      <Card
        style={{
          position: 'absolute',
          width: '85vmin',
          top: 5,
          left: 5,
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
        <CardContent
          style={{ display: 'flex', padding: 5, justifyContent: 'center' }}
        >
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={showCircle}
                    onChange={(e) => setShowCircle(e.target.checked)}
                    name="showCircle"
                  />
                }
                label={
                  <Typography variant="body2">
                    Show Hotspots{' '}
                    <DegreeLabel degree={1} flickerSwitch={flickerSwitch} />
                    <DegreeLabel degree={2} flickerSwitch={flickerSwitch} />
                    <DegreeLabel degree={3} flickerSwitch={flickerSwitch} />
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={showRadar}
                    onChange={(e) => setShowRadar(e.target.checked)}
                    name="showRadar"
                  />
                }
                label={
                  <Typography variant="body2">
                    Hotspot Radar &amp; Notifications
                  </Typography>
                }
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <FormControlLabel
                  style={{ margin: 0 }}
                  control={
                    <GradientSlider
                      t={radarRadius ? radarRadius / 5 : 0}
                      disabled={!showRadar}
                      value={typeof radarRadius === 'number' ? radarRadius : 1}
                      onChange={(e, v) => setRadarRadius(v)}
                      min={0.1}
                      max={5}
                      step={0.1}
                      valueLabelDisplay="auto"
                      marks={[
                        { value: 0.1, label: '0.1km' },
                        { value: 5, label: '5km' },
                      ]}
                    />
                  }
                />
                <Typography variant="body2">Radar Radius</Typography>
              </div>
            </FormGroup>
          </FormControl>
        </CardContent>
      </Card>
    </Grow>
  );
});
