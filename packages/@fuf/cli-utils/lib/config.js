module.exports = {
  env: {},
  INTERNAL_COMMAND_PKG: {
    create: {
      pkgName: '@fuf/cli-create-command',
      version: '1.0.4',
    },
    add: {
      pkgName: '@fuf/cli-add-command',
      version: '1.0.4',
    }
  },
  INTERNAL_TEMPLATE_PKG: {
    vue2: {
      pkgName: '@fuf/cli-template-vue2',
      version: '1.0.0',
      desc: 'Vue2 模板',
    },
    vue3: {
      pkgName: '@fuf/cli-template-vue3',
      version: '1.0.0',
      desc: 'Vue3 模板',
    },
    node: {
      pkgName: '@fuf/cli-template-node',
      version: '1.0.4',
      desc: 'Node 模板',
    },
  },
};
