const os = require('os');
// const minimist = require('minimist');
const checkNodeVersion = require('./prepare/checkNodeVersion');
const checkPkgVersion = require('./prepare/checkPkgVersion');
const checkEnv = require('./prepare/checkEnv');
const Command = require('./command');

const prepare = () => {
  checkNodeVersion(process.version);
  checkPkgVersion();
  checkEnv(os.homedir());
};

function cli() {
  prepare();

  new Command().register(process.argv);
}

module.exports = cli;
