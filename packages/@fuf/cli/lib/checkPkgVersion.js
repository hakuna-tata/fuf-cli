const updateNotifier = require('update-notifier');
const chalk = require('chalk');
const { isInstallGloabally } = require('is-installed-globally');
const pkg = require('../package.json');

const checkPkgVersion = () => {
  updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60
  }).notify({
    defer: false,
    message: `Update available
      ${chalk.dim('{currentVersion}')}
      ${chalk.reset(' → ')} ${chalk.green('{latestVersion}')}
      Run ${chalk.cyan(`npm i ${isInstallGloabally ? '-g' : ''}${pkg.name}`)}
      to update`,
  });
};

module.exports = checkPkgVersion;
