export const circleColors = {
  1: {
    [true]: 'rgba(248,59,32,0.25)',
    [false]: 'rgba(248,59,32,0.10)',
  },
  2: {
    [true]: 'rgba(248,59,32,0.55)',
    [false]: 'rgba(248,59,32,0.10)',
  },
  3: {
    [true]: 'rgba(248,59,32,0.8)',
    [false]: 'rgba(248,59,32,0.10)',
  },
};

export const circleLabelColors = {
  1: {
    [true]: 'rgba(255,80,80,1)',
    [false]: 'rgba(248,80,100,1)',
  },
  2: {
    [true]: 'rgba(255,255,255,1)',
    [false]: 'rgba(248,60,100,1)',
  },
  3: {
    [true]: 'rgba(255,255,255,1)',
    [false]: 'rgba(255,59,32,1)',
  },
};

export default function DegreeLabel({ degree, flickerSwitch, label = degree }) {
  return (
    <span
      style={{
        padding: '4px 8px',
        borderRadius: '50%',
        backgroundColor: circleColors[degree][flickerSwitch],
        color: circleLabelColors[degree][flickerSwitch],
        transition: 'background-color 0.5s, color 0.5s',
        fontWeight: '900',
      }}
    >
      {label}
    </span>
  );
}
