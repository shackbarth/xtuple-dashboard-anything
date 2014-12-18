# xTuple Dashboard Anywhere Extension

## Install Dependencies

```
npm install -g grunt-cli
npm install
```

## Run in xTuple

```
$ cd xtuple
$ npm link ../xtuple-dashboard-anything
$ ./scripts/build_app.js -n -e node_modules/xtuple-dashboard-anything
```

Then navigate to `https://host/demo_dev/npm/xtuple-dashboard-anything/public/dashboards.html`

## Development

Compile the React views during development:

`grunt watch`
