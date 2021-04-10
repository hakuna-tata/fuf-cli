const checkPkgVersion = require('./checkPkgVersion');

function cli() {
  try {
    checkPkgVersion();
  } catch (e) { }
}

module.exports = cli;
