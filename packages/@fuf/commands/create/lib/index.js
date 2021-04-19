const fse = require('fs-extra');
const path = require('path');
const { File, Inquirer } = require('@fuf/cli-utils');
const Hook = require('./hook');

class createCommand extends Hook {
  init(options) {
    const { name = '', force = false } = options;
    this.projectName = name;
    this.force = force;

    this.push(this.checkDir.bind(this))
        .push(this.downLoadTmp.bind(this));

    this.next();
  }

  async checkDir() {
    const currentPath = process.cwd();
    const isDirExist = File.isDirExist(path.join(currentPath, this.projectName));

    if(isDirExist && this.force) {
      fse.removeSync(path.join(currentPath, this.projectName));
    }

    if(isDirExist && this.force === false) {
      const result = await Inquirer({
        type: 'confirm',
        message: `是否清空 ${this.projectName} 文件`,
        default: false,
      });
      
      if (result.name === false) return;
      fse.removeSync(path.join(currentPath, this.projectName));
    }

    this.next();
  }

  downLoadTmp() {
    this.next();
  }

}

const create = (options) => {
  const instance = new createCommand();
  instance.init.call(instance, options);
};

module.exports = create;
