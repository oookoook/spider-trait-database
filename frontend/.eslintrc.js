module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  'extends': [
    'plugin:vue/essential',
    //'@vue/standard',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 2021,
    sourceType: 'module'
  }
}
