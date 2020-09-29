module.exports = {
  'env': {
    'es6': true,
    'node': true,
  },
  'extends': [
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'rules': {
    // increase max len size 80 to 100
    'max-len': ['error', {'code': 100}],
    // disable constructor names to begin with a capital letter
    'new-cap': ['error', {'capIsNew': false}],
  },
};
