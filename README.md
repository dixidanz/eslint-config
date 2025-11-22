# @dixidan/eslint-config

[![npm](https://img.shields.io/npm/v/@dixidan/eslint-config?color=444&label=)](https://npmjs.com/package/@dixidan/eslint-config)

> forked from [@antfu/eslint-config](https://github.com/antfu/eslint-config).

### Install

```bash
pnpm i -D eslint @dixidan/eslint-config
```

And create `eslint.config.mjs` in your project root:

```js
// eslint.config.mjs
import dixidan from '@dixidan/eslint-config'

export default dixidan()
```

### Install simple-git-hooks and lint-staged

```bash
pnpm i -D simple-git-hooks lint-staged

```

Add the following to your package.json

```json
  "simple-git-hooks": {
    "pre-commit": "npx lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
```