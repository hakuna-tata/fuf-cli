const axios = require('axios');

const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 1000,
});

const INTERNAL_COMMAND_PKG = {};
const INTERNAL_TEMPLATE_PKG = {};


const getCommandConfig = async () => {
  return await instance.request({
    method: 'get',
    url: '@fuf/command',
  })
    .then(({ data }) => {
      data.forEach((item) => {
        INTERNAL_COMMAND_PKG[item.command] = item.pkgInfo;
      });

      return {
        INTERNAL_COMMAND_PKG
      };
    })
    .catch(() => {
      return {};
    });
};

const getTemplateConfig = async () => {
  return await instance.request({
    method: 'get',
    url: '@fuf/template',
  })
    .then(({ data }) => {
      data.forEach((item) => {
        INTERNAL_TEMPLATE_PKG[item.tech] = item.pkgInfo;
      });

      return {
        INTERNAL_TEMPLATE_PKG
      };
    })
    .catch(() => {
      return {};
    });
};

module.exports = {
  getCommandConfig,
  getTemplateConfig
};
