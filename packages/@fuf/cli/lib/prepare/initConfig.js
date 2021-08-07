const path = require('path');
const fs = require('fs');
const { getCommandConfig, getTemplateConfig } = require('../api/getConfig');
const { Constant, Spinner } = require('@fuf/cli-utils');

const checkFufDir = (homePath) => {
  if (!homePath) {
    Spinner('fail', '当前登录用户主目录不存在!');
    process.exit(1);
  }
  const root = path.join(homePath, `${Constant.FUF_ROOT}`);
  try {
    const stats = fs.statSync(root);
    if (!stats.isDirectory()) {
      fs.unlinkSync(root);
      fs.mkdirSync(root);
    }
  } catch (e) {
    fs.mkdirSync(root);
  }
};

const initConfig = async (homePath) => {
  checkFufDir(homePath);

  const fufConfigFile = path.join(homePath, `${Constant.FUF_ROOT}/${Constant.FUF_CONFIG}`);
  if (!fs.existsSync(fufConfigFile)) {
    const [command, template] = await Promise.all([getCommandConfig(), getTemplateConfig()]);
    try {
      fs.writeFileSync(
        fufConfigFile,
        JSON.stringify(Object.assign({}, command, template)),
        'utf-8'
      );

      Spinner('succeed', '初始化配置成功');
    } catch(_) {
      Spinner('fail', '初始化配置失败');
      process.exit(1);
    }
  }
};

module.exports = initConfig;
