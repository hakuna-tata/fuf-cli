const path = require('path');
const fs = require('fs');
const doeEnv = require('dotenv');
const { Constant, Logger } = require('@fuf/cli-utils');

// 保证文件一定存在，文件不存在则创建文件
const fileExist = (filePath) => {
  try {
    fs.readFileSync(filePath, 'utf-8');
  } catch (_) {
    fs.appendFileSync(filePath, '', 'utf-8');
  }
};

const checkFuf = (homePath) => {
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
    fileExist(path.join(root, Constant.FUF_ENV));
  } catch (e) {
    fs.mkdirSync(root);
    fileExist(path.join(root, Constant.FUF_ENV));
  }
};

const initEnv = (homePath) => {
  checkFuf(homePath);

  const envConfig = doeEnv.parse(fs.readFileSync(
    path.join(homePath,`${Constant.FUF_ROOT}/${Constant.FUF_ENV}`)
  ));

  for(const k in envConfig) {
    process.env[k] = envConfig[k];
  }
};

module.exports = initEnv;
