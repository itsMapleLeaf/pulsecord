require("@rushstack/eslint-patch/modern-module-resolution")

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [require.resolve("@itsmapleleaf/configs/eslint")],
  ignorePatterns: [
    "**/node_modules/**",
    "**/build/**",
    "**/dist/**",
    "**/.cache/**",
    "**/coverage/**",
    "**/public/**",
  ],
  rules: {
    "unicorn/prefer-module": "off",
  },
  parserOptions: {
    project: require.resolve("./tsconfig.json"),
  },
}
