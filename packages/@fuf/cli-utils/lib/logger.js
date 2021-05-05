const chalk = require('chalk');

module.exports = {
  log: (msg) => {
    console.log(chalk.green(msg));
  },
};
