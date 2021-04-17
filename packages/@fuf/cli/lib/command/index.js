const path = require('path');
const os = require('os');
const figlet = require('figlet');
const chalk = require('chalk');
const program = require('commander');
const { Constant, File, Logger, Package } = require('@fuf/cli-utils');
const pkg = require('../../package.json');

const NO_COMMAND_ARGS_LENGTH = 2;

const actions = (name, opts, cmd) => {
  const cacheRoot = path.join(os.homedir(), Constant.FUF_ROOT);

  if (File.isDirExist(cacheRoot)) {
    const pkg = new Package(name, opts, cmd.name(), cacheRoot);
    pkg.getPkgEntry();
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
      .action((name, options, cmd) => {
        actions(name, options, cmd);
      });

    program
      .command('add <plugin> [pluginOptions]')
      .description('install a plugin')
      .option('--registry <path>', 'install dependencies(local file path or npm packages name)')
      .action((name, optionals, options, cmd) => {
        actions(name, options, cmd);
      });

    program
      .command('remove <plugin> [pluginOptions]')
      .description('remove a plugin')
      .action((name, optionals, options, cmd) => {
        actions(name, options, cmd);
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
