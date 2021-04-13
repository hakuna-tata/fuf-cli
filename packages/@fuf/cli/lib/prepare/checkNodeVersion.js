const { Logger } = require('@fuf/cli-utils');
const semver = require('semver');

const LOWEST_NODE_VERSION = '8.0.0';

const checkNodeVersion = (cur) => {
  if (!semver.gte(cur, LOWEST_NODE_VERSION)) {
    Logger.error(`fuf-cli 需要安装 v${LOWEST_NODE_VERSION} 以上版本的 Node.js`);
    process.exit(1);
  }
};

module.exports = checkNodeVersion;
