const path = require('path');
const fs = require('fs');
const axios = require('axios');
const npminstall = require('npminstall');
const semver = require('semver');
const File = require('./file');
const Logger = require('./logger');
const pkg = require('../package.json');

const NPM_URL = 'https://registry.npmjs.org';

const INTERNAL_COMMAND = {
  create: '@fuf/cli-create-command',
  add: '@fuf/cli-add-command',
  remove: '@fuf/cli-remove-command',
};

class Package {
  constructor(pkgName, cacheRoot) {
    this.cacheRoot = cacheRoot;
    this.pkgName = INTERNAL_COMMAND[pkgName] || pkgName;
    this.pkgVersion = pkg.version;
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

  async getPkgLatestVersion(url) {
    return axios.get(url).then((res) => {
      if (res.status === 200) {
        return res.data['dist-tags'].latest;
      }
    }).catch((err) => {
      Logger.error(err);
    });
  }

  async checkPkg() {
    if (this.isPkgExist(this.pkgVersion, this.pkgName)) {
      await this.pkgUpdate();
    } else {
      await this.pkgInstall();
    }
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

  async pkgUpdate() {
    const latestVersion = await this.getPkgLatestVersion(`${NPM_URL}/${this.pkgName}`);

    if (this.isPkgExist(latestVersion, this.pkgName)) {
      this.pkgVersion = latestVersion;
      return;
    }

    if (latestVersion && semver.gt(latestVersion, this.pkgVersion)) {
      this.pkgVersion = latestVersion;
      Logger.log('Success：命令插件自动更新');

      return npminstall({
        root: this.cacheRoot,
        pkgs: [{
          name: this.pkgName,
          version: latestVersion
        }]
      }).catch((err) => {
        Logger.error(err);
        process.exit(1);
      });
    }
  }

  async pkgInstall() {
    return npminstall({
      root: this.cacheRoot,
      pkgs: [{
        name: this.pkgName,
        version: this.pkgVersion
      }]
    }).catch((err) => {
      Logger.error(err);
      process.exit(1);
    });
  }
}

module.exports = Package;
