const path = require('path');
const fs = require('fs');
const axios = require('axios');
const npminstall = require('npminstall');
const semver = require('semver');
const File = require('./file');
const Spinner = require('./spinner');
const Constant = require('./constant');

const NPM_URL = 'https://registry.npmjs.org';

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

const updateFufConfig = (filePath, cmdName, latestVersion) => {
  const originData = readFufConfig(filePath);
  const { INTERNAL_COMMAND_PKG = {}, INTERNAL_TEMPLATE_PKG = {} } = originData;

  const pkgInfo = INTERNAL_COMMAND_PKG[cmdName] || INTERNAL_TEMPLATE_PKG[cmdName];
  pkgInfo.version = latestVersion;

  try {
    fs.writeFileSync(filePath, JSON.stringify(originData), 'utf-8');
  
    Spinner('succeed', '配置更新成功');
  } catch(_) {
    Spinner('fail', '配置更新失败');
    process.exit(1);
  }
};

class Package {
  constructor(cmdName, cacheRoot) {
    this.cmdName = cmdName;
    this.cacheRoot = cacheRoot;

    const { INTERNAL_COMMAND_PKG = {}, INTERNAL_TEMPLATE_PKG = {} }
      = readFufConfig(path.join(this.cacheRoot, `${Constant.FUF_CONFIG}`));

    const pkgInfo = INTERNAL_COMMAND_PKG[cmdName] || INTERNAL_TEMPLATE_PKG[cmdName];

    this.pkgName = pkgInfo.pkgName;
    this.pkgVersion = pkgInfo.version;
  }

  pkgPath(version, name) {
    return path.join(this.cacheRoot, 'node_modules',
      this.prefixPkgName(version, name)
    );
  }

  prefixPkgName(version, name) {
    const parseName = name.replace('/', '_');

    return `_${parseName}@${version}@${name}`;
  }

  isPkgExist(version, name) {
    return fs.existsSync(this.pkgPath(version, name));
  }

  async getPkgEntryPath() {
    await this.checkPkg();

    try {
      const calcPkgPath = this.pkgPath(this.pkgVersion, this.pkgName);

      return path.join(calcPkgPath, File.parseEntryFile(calcPkgPath));
    } catch(_) {
      return null;
    }
  }

  async checkPkg() {
    Spinner('start', `正在检查安装 ${this.pkgName} 最新版本`);
    const latestVersion = await this.getPkgLatestVersion(`${NPM_URL}/${this.pkgName}`);

    if (latestVersion && semver.gt(latestVersion, this.pkgVersion)) {
      this.pkgVersion = latestVersion;
      
      updateFufConfig(path.join(this.cacheRoot, `${Constant.FUF_CONFIG}`),
        this.cmdName,
        latestVersion
      );
    }
  
    if (!this.isPkgExist(this.pkgVersion, this.pkgName)) {
      await this.pkgInstall();
      
      Spinner('succeed', `${this.pkgName}@${this.pkgVersion} 安装成功`);
    } else {
      Spinner('succeed', `${this.pkgName} 已是最新版本`);
    }
  }

  async getPkgLatestVersion(url) {
    return axios.get(url).then((res) => {
      if (res.status === 200) {
        return res.data['dist-tags'].latest;
      }
    }).catch(() => {
      Spinner('fail', `npm 包地址: ${url} 不存在`);
    });
  }

  async pkgInstall() {
    Spinner('stop');
    return npminstall({
      root: this.cacheRoot,
      pkgs: [{
        name: this.pkgName,
        version: this.pkgVersion
      }]
    }).catch(() => {
      Spinner('fail', `${this.pkgName}@${this.pkgVersion} 安装失败`);
      process.exit(1);
    });
  }
}

module.exports = Package;
