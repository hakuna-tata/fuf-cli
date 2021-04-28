const os = require('os');
const checkNodeVersion = require('./prepare/checkNodeVersion');
const checkPkgVersion = require('./prepare/checkPkgVersion');
const initConfig = require('./prepare/initConfig');
const Command = require('./command');

const prepare = () => {
  checkNodeVersion(process.version);
  checkPkgVersion();
  initConfig(os.homedir());
};

function cli() {
  prepare();

  new Command().register(process.argv);
}

module.exports = cli;
