// https://codepen.io/njmcode/pen/axoyD/
export const interpolateRGB = (c1, c2, t) => {
  const [rgb1, rgb2] = [c1, c2].map((c) => {
    const it = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
    return it
      ? [parseInt(it[1], 16), parseInt(it[2], 16), parseInt(it[3], 16)]
      : null;
  });

  if (!rgb1 || !rgb2) {
    return null;
  }

  const rgb = rgb1.map((c1, i) => {
    const c2 = rgb2[i];
    return c1 * (1 - t) + c2 * t;
  });

  return (
    '#' +
    ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
  );
};
