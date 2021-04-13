const os = require('os');
const checkNodeVersion = require('./prepare/checkNodeVersion');
const checkPkgVersion = require('./prepare/checkPkgVersion');
const checkEnv = require('./prepare/checkEnv');

const prepare = () => {
  checkNodeVersion(process.version);
  checkPkgVersion();
  checkEnv(os.homedir());
};

function cli() {
  prepare();
}

module.exports = cli;
