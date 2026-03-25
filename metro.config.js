const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// AlaSQL's filesystem build pulls in `react-native-fetch-blob` which is not
// available in the browser. We stub it out with an empty module so the web
// bundle resolves without errors.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-fetch-blob') {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
