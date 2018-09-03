const postcssAspectRatioMini = require('postcss-aspect-ratio-mini');
const postcssPxToViewport = require('postcss-px-to-viewport');
const postcssWriteSvg = require('postcss-write-svg');
const postcssPresetEnv = require('postcss-preset-env');
const postcssViewportUnits = require('postcss-viewport-units');
const cssnano = require('cssnano');

module.exports = () => ({
  plugins: [
    postcssAspectRatioMini(),
    postcssPxToViewport({
      viewportWidth: 750, // (Number) The width of the viewport.
      viewportHeight: 1334, // (Number) The height of the viewport.
      unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
      viewportUnit: 'vw', // (String) Expected units.
      selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
      minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
      mediaQuery: false // (Boolean) Allow px to be converted in media queries.
    }),
    postcssWriteSvg({
      utf8: false
    }),
    postcssPresetEnv(),
    postcssViewportUnits(),
    cssnano({
      preset: 'advanced',
      autoprefixer: false,
      zindex: false
    })
  ]
});
