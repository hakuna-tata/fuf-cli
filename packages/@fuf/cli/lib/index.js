const os = require('os');
const minimist = require('minimist');
const checkNodeVersion = require('./prepare/checkNodeVersion');
const checkPkgVersion = require('./prepare/checkPkgVersion');
const checkEnv = require('./prepare/checkEnv');

const Fuf = require('./core');

const prepare = () => {
  checkNodeVersion(process.version);
  checkPkgVersion();
  checkEnv(os.homedir());
};

function cli() {
  prepare();

  const args = minimist(process.argv.slice(2));
  new Fuf(args);
}

module.exports = cli;
