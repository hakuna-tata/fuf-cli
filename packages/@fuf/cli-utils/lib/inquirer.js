const inquirer = require('inquirer');

module.exports = (options) => {
    options.name = 'name';
    return inquirer.prompt(options);
};
