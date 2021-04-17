const path = require('path');
const os = require('os');
const figlet = require('figlet');
const chalk = require('chalk');
const program = require('commander');
const Package = require('./package');
const { Constant, File, Logger } = require('@fuf/cli-utils');
const pkg = require('../../package.json');

const NO_COMMAND_ARGS_LENGTH = 2;

const actions = async (opts, cmd) => {
  const cacheRoot = path.join(os.homedir(), Constant.FUF_ROOT);

  if (File.isDirExist(cacheRoot)) {
    const pkg = new Package(cmd.name(), cacheRoot);
    const entryFile = await pkg.getPkgEntry();

    Logger.log(entryFile);
  } else {
    Logger.error(`${cacheRoot} is not exist`);
  }
};

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
        if (err) process.exit(1);
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
      .action((name, options, cmd) => {
        actions(options, cmd, name);
      });

    program
      .command('add')
      .description('add a plugin')
      .option('--plugin <pluginName>', 'add plugin(npm)')
      .option('--path <path>', 'add plugin(for local file)')
      .action((options, cmd) => {
        actions(options, cmd);
      });

    program
      .command('remove')
      .description('remove a plugin')
      .option('--plugin <pluginName>', 'remove plugin(for npm)')
      .option('--path <path>', 'remove plugin(for local file)')
      .action((options, cmd) => {
        actions(options, cmd);
      });

    program.on('command:*', ([cmd]) => {
      program.outputHelp();
      Logger.error(`Unknown command ${chalk.yellow(cmd)}`);
      process.exitCode = 1;
    });

    program.parse(args);
  }
}

module.exports = Command;
