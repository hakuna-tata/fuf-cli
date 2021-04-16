const os = require('os');
const checkNodeVersion = require('./prepare/checkNodeVersion');
const checkPkgVersion = require('./prepare/checkPkgVersion');
const initEnv = require('./prepare/initEnv');
const Command = require('./command');

const prepare = () => {
  checkNodeVersion(process.version);
  checkPkgVersion();
  initEnv(os.homedir());
};

function cli() {
  prepare();

  new Command().register(process.argv);
}

module.exports = cli;
