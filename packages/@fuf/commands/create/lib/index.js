const Hook = require('./hook');

class createCommand extends Hook {
  init(options) {
    const { name = '', force = false } = options;
    this.projectName = name;
    this.force = force;

    this.on(this.prepare.bind(this))
        .on(this.downLoadTmp.bind(this));

    this.emit();
  }

  prepare() {
    const currentPath = process.cwd();
    console.log(currentPath);

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
