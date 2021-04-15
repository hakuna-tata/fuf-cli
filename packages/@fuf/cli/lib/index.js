const os = require('os');
// const minimist = require('minimist');
const checkNodeVersion = require('./prepare/checkNodeVersion');
const checkPkgVersion = require('./prepare/checkPkgVersion');
const checkEnv = require('./prepare/checkEnv');
const Commander = require('./commander');

const prepare = () => {
  checkNodeVersion(process.version);
  checkPkgVersion();
  checkEnv(os.homedir());
};

function cli() {
  prepare();

  new Commander().register();
}

module.exports = cli;
