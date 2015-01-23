# xTuple Dashboard Anywhere Extension

## Production Install

```
$ cd xtuple
$ npm install xtuple-dashboard-anything
$ ./scripts/build_app.js -e node_modules/xtuple-dashboard-anything
```

And restart the datasource.

Alternatively, you can get all this done by doing an install-extension
of xtuple-dashboard-anything from the Enyo database config screen.

## Dev install

```
$ cd xtuple-dashboard-anything
$ npm install -g grunt-cli
$ npm install
$ ./node_modules/grunt-cli/bin/grunt watch
$ cd ../xtuple
$ npm link ../xtuple-dashboard-anything
$ npm link xtuple-dashboard-anything
$ ./scripts/build_app.js -n -e node_modules/xtuple-dashboard-anything
```

## Find the app
For either dev or production installs, you can find the app
by navigating to `https://{host}/{database_name}/npm/xtuple-dashboard-anything/public/index.html`
