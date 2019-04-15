module.exports = {
  extends: "airbnb",
  parser: "babel-eslint",
  env: {
    jest: true
  },
  rules: {
    "no-use-before-define": "off",
    "react/jsx-filename-extension": "off",
    "react/prefer-stateless-function": "off",
    "react/prop-types": "off",
    "comma-dangle": "off",
    "linebreak-style": "off",
    quotes: "off",
    semi: "off",
    "implicit-arrow-linebreak": "off",
    "react/destructuring-assignment": "off",
    "react/jsx-one-expression-per-line": "off",
    "object-curly-newline": "off",
    "class-methods-use-this": "off",
    "no-console": "off",
    "prefer-destructuring": "off",
    "import/prefer-default-export": "off",
    "react/sort-comp": "off",
    curly: "off",
    "nonblock-statement-body-position": "off",
    "arrow-parens": "off",
    "no-underscore-dangle": "off",
    "react/jsx-wrap-multilines": "off",
    "react/no-multi-comp": "off",
    "consistent-return": "off",
    "react/no-unescaped-entities": "off"
  },
  globals: {
    fetch: false
  }
}
