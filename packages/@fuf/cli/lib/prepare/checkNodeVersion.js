const semver = require('semver');
const { Spinner } = require('@fuf/cli-utils');
const reqVersion = require('../../package.json').engines.node;

const checkNodeVersion = (cur) => {
  if (!semver.satisfies(cur, reqVersion)) {
    Spinner('fail', `fuf-cli 需要安装 v${reqVersion} 以上版本的 Node.js`);
    process.exit(1);
  }
};

module.exports = checkNodeVersion;
