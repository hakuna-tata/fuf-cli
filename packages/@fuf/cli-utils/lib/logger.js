const chalk = require('chalk');

module.exports = {
  log: (msg) => {
    console.log(chalk.green(msg));
  },
  error: (msg) => {
    console.log(chalk.white.bgRed.bold('Error: ') + chalk.blue.bold(`${msg}`));
  }
};
