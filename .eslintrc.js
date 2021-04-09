module.exports = {
    root: true,
    extends: ["eslint:recommended"],
    env: {
      "node": true,
      "commonjs": true,
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module"
    },
    rules: {
      "no-empty": 0,
      "no-console": 1,
      "semi": [2, "always"],
      "quotes": [2, 'single'],
      "key-spacing": [2, { beforeColon: false, afterColon: true }],
      "no-alert": 2,
      "no-var": 2,
      "eqeqeq": 2,
    },
};
