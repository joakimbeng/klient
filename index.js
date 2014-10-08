var request = require('request');
var Promise = require('bluebird');

module.exports = exports = function init (options) {
  var api = {
    service: getService.bind(null, options.host),
    value: getValue.bind(null, options.host)
  };

  if (options.promise) {
    return {
      service: Promise.promisify(api.service),
      value: Promise.promisify(api.value)
    }
  }

  return api;
};

function getService (host, service, cb) {
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
