
module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "jest": true,
  },
  "extends": "airbnb-base",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "rules": {
    "linebreak-style": 0,
    "max-classes-per-file": ["error", 3],
    "import/no-cycle": [0, { maxDepth: 1 }],
    "import/no-named-as-default": 0,
    "import/no-named-as-default-member": 0,
    "import/prefer-default-export": "off",
    "class-methods-use-this": 0,
    "no-underscore-dangle": 'off'
  },

};
