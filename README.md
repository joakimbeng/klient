klient
=======

> A client for [Katalog](https://registry.hub.docker.com/u/joakimbeng/katalog/), the simple Docker service catalog and discovery application

## Usage

```javascript
var klient = require('klient')({
  host: 'http://<host/ip for Katalog>:<katalog port>'
});

klient.service('<service name>', function (err, nodes) {
  // `nodes` contains all nodes that serves the wanted service
});

klient.value('<key name>', function (err, value) {
  // Get a value from the Katalog key/value store
});
```

### Options

#### `host`

**Type:** `String`


The full URI to the Katalog API.


#### `promise`

**Type:** `Boolean`


If `true` the returned api will be promisified, i.e. `klient.value('<key>').then(...)`.

