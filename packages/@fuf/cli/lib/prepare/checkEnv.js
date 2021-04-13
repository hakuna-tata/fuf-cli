const path = require('path');
const fs = require('fs');
const doeEnv = require('dotenv');
const { Logger } = require('@fuf/cli-utils');

const FUF_ENV = '.env';

const checkEnv = (userHome) => {
  if (!userHome) {
    Logger.error('当前登录用户主目录不存在！');
    process.exit(1);
  }

  const root = path.join(userHome, FUF_ENV);
  fs.stat(root, (err, stats) => {
    if (err) {
      fs.createWriteStream(root);
    }
    if (stats && stats.isFile()) {
      const envConfig = doeEnv.parse(fs.readFileSync(root));
      for (const k in envConfig) {
        process.env[k] = envConfig[k];
      }
    }
  });
};

module.exports = checkEnv;
