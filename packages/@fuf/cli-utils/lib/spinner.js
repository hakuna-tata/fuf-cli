const chalk = require('chalk');
const ora = require('ora');

const spinner = ora();

module.exports = (type, text) => {
    switch(type) {
        case 'stop':
            spinner.stop();
            return;

        case 'succeed':
            text = chalk.green(text);
            break;

        case 'fail':
            text = chalk.red(text);
            break;
        
        default:
    }

    spinner[type](text);
};