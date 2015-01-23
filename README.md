# xTuple Dashboard Anything

Dashboard-Anything is a web view that lets you create a dashboard
from charts powered by any business object in the application. It follows
the convention by which you can pull a list of business object per a certain
optional filter, group by some field on that object, and total either a
numeric field on the object or just the count of objects.

Each user can customize their own charts, using all the existing objects
in the system. If you're looking for a presentation
of arbitrarily complicated SQL calculations, you'll want to create a view
and write an ORM on top of it, per the example [here](https://github.com/shackbarth/xtuple-extensions/tree/master/source/xtuple-field-dev-sample-2).
(You don't need to worry about the `client` directory in this example, only the
database view and the ORM.) Because dashboard-anything uses the REST discovery
service, it will instantly find out about any newly-installed ORMs.

These are operational dashboards, and there is a cap on the amount of data
that it will want to query. If you're looking for analytics of large amounts
of data, for historical reporting, YTD comparisons, and the like, you should
invest in
[Business Intelligence](http://www.xtuple.com/solutions/business-intelligence).


## Production Install

```
$ cd xtuple
$ ./scripts/build_app.js -e node_modules/xtuple-dashboard-anything
```

And restart the datasource.

Alternatively, you can get all this done by doing an install-extension
of xtuple-dashboard-anything from the Enyo database config screen.

## Dev install

```
$ cd xtuple-dashboard-anything
$ npm install
$ grunt watch
$ cd ../xtuple
$ npm link ../xtuple-dashboard-anything
$ ./scripts/build_app.js -n -e node_modules/xtuple-dashboard-anything
```

## Find the app
For either dev or production installs, you can find the app
by navigating to `https://{host}/{database_name}/npm/xtuple-dashboard-anything/public/index.html`
