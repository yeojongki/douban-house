const { getBabelLoader } = require('react-app-rewired');

module.exports = function rewire(config) {
  const jsxLoader = getBabelLoader(
    config.module.rules,
    rule => String(rule.test) === String(/\.(js|jsx|mjs)$/)
  );
  let options = jsxLoader.options;

  const babelrc = require(options.presets[0]);
  babelrc.plugins = [
    ['styled-jsx/babel', { plugins: ['styled-jsx-plugin-sass'] }]
  ].concat(babelrc.plugins || []);
  options.presets = babelrc;

  return config;
};
