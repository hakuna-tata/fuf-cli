const path = require('path');
const os = require('os');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const { Constant, File } = require('@fuf/cli-utils');
const Hook = require('./hook');

const EXIST_TPL = [
  {
    value: '@fuf/cli-template-vue2',
    name: 'Vue2 模板',
  },
  {
    value: '@fuf/cli-template-node',
    name: 'Node 模板',
  },
  {
    value: '@fuf/cli-template-react',
    name: 'React 模板 (正在开发中......)',
  }
];

const SUPPORT_LANG = [
  {
    value: 'js',
    name: 'JavaScript',
  },
  {
    value: 'ts',
    name: 'TypeScript',
  }
];

class createCommand extends Hook {
  init(options) {
    this.cacheRoot = path.join(os.homedir(), Constant.FUF_ROOT);

    const { name = '', force = false } = options;
    this.projectName = name;
    this.force = force;

    this.push(this.checkDir.bind(this))
        .push(this.choiceTemplate.bind(this))
        .push(this.downLoadTemplate.bind(this));

    this.next();
  }

  async checkDir() {
    const currentPath = process.cwd();
    const isDirExist = File.isDirExist(path.join(currentPath, this.projectName));

    if(isDirExist) {
      if (this.force === true) {
        fse.emptyDirSync(path.join(currentPath, this.projectName));
      } else {
        const result = await inquirer.prompt({
          type: 'confirm',
          name: 'clear',
          message: `是否清空 ${this.projectName} 文件`,
          default: false,
        });

        if (result.clear === false) return;
        fse.emptyDirSync(path.join(currentPath, this.projectName));
      }
    } else {
      fse.mkdirpSync(path.join(currentPath, this.projectName));
    }

    this.next();
  }

  async choiceTemplate() {
    const { template } = await inquirer.prompt({
      type: 'list',
      name: 'template',
      message: '请选择项目模板',
      choices: EXIST_TPL,
      default: 0
    });
    
    const { language } = await inquirer.prompt({
      type: 'list',
      name: 'language',
      message: '请选择语言',
      choices: SUPPORT_LANG,
      default: 0
    });

    this.next({ template, language });
  }

  downLoadTemplate(choices) {
    console.log(choices);
  }

}

const create = (options) => {
  const instance = new createCommand();
  instance.init.call(instance, options);
};

module.exports = create;
