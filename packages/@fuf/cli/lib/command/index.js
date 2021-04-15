const program = require('commander');
const figlet = require('figlet');
const { Logger } = require('@fuf/cli-utils');
const pkg = require('../../package.json');

const NO_COMMAND_ARGS_LENGTH = 2;


class Command {
  register(args) {
    if (args.length === NO_COMMAND_ARGS_LENGTH) {
      this.printCliBanner();
      return;
    }

    program
      .version(pkg.version)
      .usage('<command> [options]');

    program.parse(args);
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
}

module.exports = Command;
