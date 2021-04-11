const chalk = require('chalk');

module.exports = {
  error: (msg) => {
    console.log(chalk.white.bgRed.bold('Error: ') + chalk.blue.bold(`${msg}`));
  }
};
