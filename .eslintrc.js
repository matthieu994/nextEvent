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
    "implicit-arrow-linebreak": "off"
  },
  globals: {
    fetch: false
  }
}
