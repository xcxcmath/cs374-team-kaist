import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles({
  root: {
    width: 200
  }
});

const CustomSlider = withStyles({
  root: {
    height: 8,
  },
  rail: {
    height: 8,
    borderRadius: 4,
    backgroundImage: "linear-gradient(.25turn, #00ff00, #ff0000)"
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundImage: "linear-gradient(.25turn, #44ff44, #ff4444)"
  }
})(Slider);

export default function ContinuousSlider() {
  const classes = useStyles();
  const [value, setValue] = React.useState(30);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <CustomSlider
        marks={[
          { value: 3, label: 'Danger' },
          { value: 2, label: '' },
          { value: 1, label: '' },
          { value: 0, label: 'Safe' },
        ]}
        min={0}
        max={3}
        step={1}
        value={value}
        onChange={handleChange}
        aria-labelledby="continuous-slider"
      />
    </div>
  );
}
