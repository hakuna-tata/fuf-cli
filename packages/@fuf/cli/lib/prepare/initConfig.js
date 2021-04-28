const path = require('path');
const fs = require('fs');
const { Config, Constant, Logger } = require('@fuf/cli-utils');

const checkFufDir = (homePath) => {
  if (!homePath) {
    Logger.error('当前登录用户主目录不存在！');
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

const initConfig = (homePath) => {
  checkFufDir(homePath);
  const fufConfigFile = path.join(homePath, `${Constant.FUF_ROOT}/${Constant.FUF_CONFIG}`);
  if (!fs.existsSync(fufConfigFile)) {
    fs.writeFile(fufConfigFile, JSON.stringify(Config), (err) => {
      if (err) {
        Logger.error('配置初始化失败');
        process.exit(1);
      }
      Logger.log('success: 配置初始化成功');
    });
  }
};

module.exports = initConfig;
