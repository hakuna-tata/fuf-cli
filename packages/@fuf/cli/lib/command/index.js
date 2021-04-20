const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const figlet = require('figlet');
const chalk = require('chalk');
const program = require('commander');
const { Constant, File, Logger, Package } = require('@fuf/cli-utils');
const pkg = require('../../package.json');

const NO_COMMAND_ARGS_LENGTH = 2;

const actions = async (opts, cmd, name) => {
  let entryFile = null;
  const cacheRoot = path.join(os.homedir(), Constant.FUF_ROOT);
  const { debugPath = ''} = opts;

  if (debugPath) {
    if (File.isDirExist(debugPath)) {
      entryFile = path.join(debugPath, File.parseEntryFile(debugPath));
    } else {
      Logger.error(`${debugPath} is not exist`);
      process.exit(1);
    }
  } else {
    if (File.isDirExist(cacheRoot)) {
      const pkg = new Package(cmd.name(), cacheRoot);
      entryFile = await pkg.getPkgEntry();
    } else {
      Logger.error(`${cacheRoot} is not exist`);
      process.exit(1);
    }
  }


  if (fs.existsSync(entryFile)) {
    // Logger.log(`${entryFile}`);
    const formatPath = File.formatFilePath(entryFile);
    const config = Object.assign(opts, { name });
    const code = `require('${formatPath}')(${JSON.stringify(config)})`;

    const cp = spawn('node', ['-e', code], {
      stdio: 'inherit',
    });

    cp.on('error', (e) => {
      Logger.error(`${e.message}`);
      process.exit(1);
    });

    cp.on('exit', (code) => {
      Logger.log(`command invoke sunccess: ${code}`);
      process.exit(code || 0);
    });

  } else {
    Logger.error(`entryFile：${entryFile} is not exist`);
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
      .command('create <appName>')
      .description('create a new project powered by @fuf/cli service')
      .option('--npmPkg <npmPkg>', 'manually specify the create package of npm Pkg')
      .option('--debugPath <debugPath>', 'manually specify the create package of local file')
      .option('-f, --force', 'Overwrite target directory if it exists')
      .action((appName, options, cmd) => {
        actions(options, cmd, appName);
      });

    program
      .command('add <pluginName>')
      .description('add a plugin')
      .option('--debugPath <debugPath>', 'manually specify the add package path')
      .action((pluginName, options, cmd) => {
        actions(options, cmd, pluginName);
      });

    program
      .command('remove <pluginName>')
      .description('remove a plugin')
      .option('--debugPath <debugPath>', 'manually specify the remove package path')
      .action((pluginName, options, cmd) => {
        actions(options, cmd, pluginName);
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
