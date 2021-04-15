const { Logger } = require('@fuf/cli-utils');
const semver = require('semver');
const reqVersion = require('../../package.json').engines.node;

const checkNodeVersion = (cur) => {
  if (!semver.satisfies(cur, reqVersion)) {
    Logger.error(`fuf-cli 需要安装 v${reqVersion} 以上版本的 Node.js`);
    process.exit(1);
  }
};

module.exports = checkNodeVersion;
