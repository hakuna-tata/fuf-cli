const figlet = require('figlet');
const chalk = require('chalk');
const program = require('commander');
const { Logger } = require('@fuf/cli-utils');
const pkg = require('../../package.json');

const NO_COMMAND_ARGS_LENGTH = 2;

class Command {
  register(args) {
    if (args.length === NO_COMMAND_ARGS_LENGTH) {
      this.printCliBanner();
      return;
    }

    this.registerCommand(args);
  }

  printCliBanner() {
    figlet.text(
      '@fuf/cli',
      {
        font: '3D-ASCII',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      },
      function(err, data) {
        if (err) {}
        Logger.log(data);
        Logger.log(`current version: v${pkg.version}, homepage: ${pkg.homepage}`);
        Logger.log('Run fuf --help(-h) to see usage');
      }
    );
  }

  registerCommand(args) {
    program
      .usage('<command> [options]')
      .version(pkg.version);

    program
      .command('create <appname>')
      .description('create a new project powered by @fuf/cli service')
      .option('-f, --force', 'Overwrite target directory if it exists')
      .action(() => {});

    program.on('command:*', ([cmd]) => {
      program.outputHelp();
      Logger.error(`Unknown command ${chalk.yellow(cmd)}`);
      process.exitCode = 1;
    });

    program.parse(args);
  }
}

module.exports = Command;
