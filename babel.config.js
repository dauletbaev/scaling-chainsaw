module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'babel-plugin-root-import',
        {
          root: __dirname,
          rootPathPrefix: '~',
          rootPathSuffix: './src',
        },
      ],
    ],
  };
};
