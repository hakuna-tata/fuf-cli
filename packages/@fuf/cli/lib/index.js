const { Logger } = require('@fuf/cli-utils');
const checkNodeVersion = require('./checkNodeVersion');
const checkPkgVersion = require('./checkPkgVersion');

function cli() {
  try {
    checkNodeVersion(process.version);
    checkPkgVersion();
  } catch (e) {
    Logger.error(e.message);
  }
}

module.exports = cli;
