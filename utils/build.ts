// Do this as the first thing so that any code reading it knows the right env.
// utils/build.ts
// eslint-disable-next-line import/no-named-as-default
import webpack, { Configuration, Stats } from 'webpack';
import path from 'path';
import fs from 'fs';
import config from '../webpack.config';
import ZipPlugin from 'zip-webpack-plugin';
import packageInfo from '../package.json' assert { type: 'json' };

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

if ('chromeExtensionBoilerplate' in config) {
  delete (config as { chromeExtensionBoilerplate?: unknown })
    .chromeExtensionBoilerplate;
}

config.mode = 'production';

// Ensure infrastructureLogging.level is set to a valid value
if (config.infrastructureLogging) {
  config.infrastructureLogging.level = 'info' as const;
}

// const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

config.plugins = (config.plugins || []).concat(
  new ZipPlugin({
    filename: `${packageInfo.name}-${packageInfo.version}.zip`,
    path: path.join(__dirname, '../', 'zip'),
  })
);

webpack(config as Configuration, (err?: Error, stats?: Stats) => {
  if (err) throw err;
});
