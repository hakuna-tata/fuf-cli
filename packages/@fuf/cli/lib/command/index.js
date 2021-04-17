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
  let entryFile = null;
  const cacheRoot = path.join(os.homedir(), Constant.FUF_ROOT);
  const { debugPath = ''} = opts;

  if (debugPath) {
    if (File.isDirExist(debugPath)) {
      entryFile = path.join(debugPath, File.parseEntryFile(debugPath));
    } else {
      Logger.error(`${debugPath} is not exist`);
    }
  } else {
    if (File.isDirExist(cacheRoot)) {
      const pkg = new Package(cmd.name(), cacheRoot);
      entryFile = await pkg.getPkgEntry();
    } else {
      Logger.error(`${cacheRoot} is not exist`);
    }
  }

  Logger.log(entryFile);
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
      .option('--debugPath <debugPath>', 'manually specify the create package path')
      .option('-f, --force', 'Overwrite target directory if it exists')
      .action((name, options, cmd) => {
        actions(options, cmd, name);
      });

    program
      .command('add')
      .description('add a plugin')
      .option('--debugPath <debugPath>', 'manually specify the addd package path')
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
