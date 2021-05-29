// **Jihun's work**
import React from 'react';
import { Slider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { interpolateRGB } from '../utils/colors';

const useStyles = makeStyles((theme) => ({
  root: () => ({
    height: 4,
  }),
  track: ({ t, disabled }) => ({
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(128, 128, 128, 0.4)',
    backgroundImage: disabled
      ? 'grey'
      : `linear-gradient(.25turn, ${theme.palette.error.main}, ${interpolateRGB(
          theme.palette.error.main,
          theme.palette.success.main,
          t
        )})`,
  }),
  thumb: () => ({
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -10,
    marginLeft: -12,
    '&:focus, &:hover, &:active': {
      boxShadow: 'inherit',
    },
  }),
  active: () => ({}),
  valueLabel: () => ({
    left: 'calc(-50% + 4px)',
  }),
  rail: () => ({
    height: 4,
    borderRadius: 2,
    backgroundImage: `linear-gradient(.25turn, ${theme.palette.error.light}, ${theme.palette.success.light})`,
  }),
}));

const Component = React.memo((props) => {
  const classes = useStyles(props);
  return (
    <Slider {...props} classes={classes}>
      {props.children}
    </Slider>
  );
});

export default function GradientSlider(props) {
  return <Component {...props} />;
}
