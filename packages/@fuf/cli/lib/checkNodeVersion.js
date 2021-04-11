const semver = require('semver');
const LOWEST_NODE_VERSION = '12.0.0';

const checkNodeVersion = (cur) => {
  if (!semver.gte(cur, LOWEST_NODE_VERSION)) {
    throw new Error(`fuf-cli 需要安装 v${LOWEST_NODE_VERSION} 以上版本的 Node.js`);
  }
};

module.exports = checkNodeVersion;
