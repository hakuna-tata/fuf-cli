const checkNodeVersion = require('./checkNodeVersion');
const checkPkgVersion = require('./checkPkgVersion');

function cli() {
  checkNodeVersion(process.version);
  checkPkgVersion();
}

module.exports = cli;
