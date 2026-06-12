const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const nodePolyfills = {
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer/'),
  util: require.resolve('util/'),
  events: require.resolve('events/'),
  path: require.resolve('path-browserify'),
  'node:stream': require.resolve('stream-browserify'),
  'node:buffer': require.resolve('buffer/'),
  'node:util': require.resolve('util/'),
  'node:events': require.resolve('events/'),
  'node:path': require.resolve('path-browserify'),
};

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 * SVG components via react-native-svg-transformer (matches Flutter asset usage)
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
module.exports = mergeConfig(defaultConfig, {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    unstable_enablePackageExports: false,
    extraNodeModules: nodePolyfills,
    resolveRequest: (context, moduleName, platform) => {
      if (nodePolyfills[moduleName]) {
        return {
          filePath: nodePolyfills[moduleName],
          type: 'sourceFile',
        };
      }

      if (moduleName.startsWith('node:')) {
        const bareName = moduleName.replace('node:', '');
        if (nodePolyfills[bareName]) {
          return {
            filePath: nodePolyfills[bareName],
            type: 'sourceFile',
          };
        }
      }

      return context.resolveRequest(context, moduleName, platform);
    },
  },
});
