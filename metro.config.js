const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add mjs support for Tamagui
config.resolver.sourceExts.push('mjs');

module.exports = config;
