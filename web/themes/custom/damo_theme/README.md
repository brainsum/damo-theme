# damo theme readme

## Install
``` bash
cd web/themes/damo_theme
yarn install

cd web/themes/contrib/damo_base
yarn install
```

## Config
Please watch out for this line in gulpfile.js:
``` javascript
var baseThemePath = '../contrib/damo_base'; // @fixme
```
