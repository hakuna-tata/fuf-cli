const path = require('path');
const fs = require('fs');
const os = require('os');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const { Constant, File, Spinner, Package } = require('@fuf/cli-utils');
const Hook = require('./hook');

const readFufConfig = (filePath) => {
  if(!fs.existsSync(filePath)) {
    Spinner('fail', `配置文件 ${Constant.FUF_CONFIG} 不存在`);
    process.exit(1);
  }

  try {
    const result = fs.readFileSync(filePath, 'utf-8');

    return result ? JSON.parse(result) : {};
  } catch(e) {
    Spinner('fail', e);
    process.exit(1);
  }
};

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
    this.fufConfig = readFufConfig(path.join(this.cacheRoot, `${Constant.FUF_CONFIG}`));

    const { name = '', force = false } = options;
    this.projectName = name;
    this.force = force;

    this.push(this.checkDir.bind(this))
        .push(this.choiceTemplate.bind(this))
        .push(this.downLoadTemplate.bind(this))
        .push(this.copyTemplat2CurDir.bind(this));

    this.next();
  }

  async checkDir() {
    const currentPath = process.cwd();
    const isDirExist = File.isDirExist(path.join(currentPath, this.projectName));

    if(isDirExist) {
      if (this.force === true) {
        fse.removeSync(path.join(currentPath, this.projectName));
      } else {
        const result = await inquirer.prompt({
          type: 'confirm',
          name: 'clear',
          message: `是否清空 ${this.projectName} 文件夹`,
          default: false,
        });

        if (result.clear === false) return;
        fse.emptyDirSync(path.join(currentPath, this.projectName));
      }
    } else {
      // 如果是文件则先删除
      fse.removeSync(path.join(currentPath, this.projectName));
    }

    this.next();
  }

  async choiceTemplate() {
    const EXIST_TPL = [];
    const { INTERNAL_TEMPLATE_PKG = {} } = this.fufConfig;

    Object.entries(INTERNAL_TEMPLATE_PKG).forEach(([key, value], index) => {
      EXIST_TPL[index] = {
        value: key,
        name: value.desc
      };
    });

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

  async downLoadTemplate(choices) {
    const { template } = choices;

    if (File.isDirExist(this.cacheRoot)) {
      const pkgInstance = new Package(template, this.cacheRoot);

      await pkgInstance.checkPkg();

      const sourcePath = pkgInstance.pkgPath();
      const targetPath = path.join(process.cwd(), this.projectName);

      this.next({ sourcePath, targetPath });
    } else {
      Spinner('fail', `缓存目录 ${this.cacheRoot} 不存在`);
      process.exit(1);
    }
  }

  copyTemplat2CurDir(pathInfo) {
    const { sourcePath, targetPath } = pathInfo;

    Spinner('start', `正在创建 ${this.projectName} 项目`);

    fse.ensureDirSync(targetPath);
    fse.copySync(sourcePath, targetPath);

    Spinner('stop');
    Spinner('succeed', `${this.projectName} 项目已完成创建`);
  }

}

const create = (options) => {
  const instance = new createCommand();
  instance.init.call(instance, options);
};

module.exports = create;
