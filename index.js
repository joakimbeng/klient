var request = require('request');
var Promise = require('bluebird');

module.exports = exports = function init (options) {
  var api = {
    service: getService.bind(null, options.host),
    services: getService.bind(null, options.host, ''),
    value: getValue.bind(null, options.host),
    values: getValue.bind(null, options.host, '')
  };

  if (options.promise) {
    return {
      service: Promise.promisify(api.service),
      services: Promise.promisify(api.services),
      value: Promise.promisify(api.value),
      values: Promise.promisify(api.values)
    }
  }

  return api;
};

function getService (host, service, opts, cb) {
  request(host + '/service/' + service, {json: true}, function (err, res, services) {
    if (err) {
      return cb(err);
    }
    return cb(null, services);
  });
}

function getValue (host, key, cb) {
  request(host + '/value/' + key, {json: true}, function (err, res, val) {
    if (err) {
      return cb(err);
    }
    return cb(null, val);
  });
}
