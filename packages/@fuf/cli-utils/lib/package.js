const INTERNAL_COMMAND = {
  create: '@fuf/cli-create-command'
};

class Package {
  constructor(name, opts, cmdName, cacheRoot) {
    this.pkgName = INTERNAL_COMMAND[name] || name;
    this.cmdName = cmdName;
    this.options = opts;
    this.cacheRoot = cacheRoot;
  }

  getPkgEntry() {}
}

module.exports = Package;
