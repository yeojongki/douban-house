const { getBabelLoader, injectBabelPlugin } = require('react-app-rewired');
const path = require('path');

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = function rewire(config) {
  // add antd-mobile
  config = injectBabelPlugin(
    ['import', { libraryName: 'antd-mobile', style: 'css' }],
    config
  );

  // add styled-jsx plugin
  const jsxLoader = getBabelLoader(
    config.module.rules,
    rule => String(rule.test) === String(/\.(js|jsx|mjs)$/)
  );
  let options = jsxLoader.options;
  let babelrc = require(options.presets[0]);
  babelrc.plugins = [
    [
      'styled-jsx/babel',
      {
        plugins: ['styled-jsx-plugin-sass', 'styled-jsx-plugin-postcss']
      }
    ]
  ].concat(babelrc.plugins || []);
  options.presets = babelrc;
  
  // add alias
  let originAlias = config.resolve.alias;
  config.resolve.alias = Object.assign(originAlias, {
    '@': resolve('src'),
    'comp': resolve('src/components')
  });

  return config;
};
