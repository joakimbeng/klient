'use strict';
var request = require('request');
var Promise = require('bluebird');

var cache = {};

module.exports = exports = function init (options) {
  var api = {
    service: getService.bind(null, options.host),
    services: getService.bind(null, options.host, ''),
    value: getValue.bind(null, options.host),
    values: getValue.bind(null, options.host, ''),
    vhosts: getVhosts.bind(null, options.host)
  };

  if (options.promise) {
    return {
      service: Promise.promisify(api.service),
      services: Promise.promisify(api.services),
      value: Promise.promisify(api.value),
      values: Promise.promisify(api.values),
      vhosts: Promise.promisify(api.vhosts)
    };
  }

  if (options.autoclear) {
    setInterval(autoClearCache, 1000 * 60);
  }

  return api;
};

function getService (host, service, cb) {
  doRequest(host + '/service/' + service, cb);
}

function getValue (host, key, cb) {
  doRequest(host + '/value/' + key, cb);
}

function getVhosts (host, cb) {
  doRequest(host + '/vhost', cb);
}

function doRequest (url, cb) {
  var timeout = 3000;
  var cacheItem = cache[url];
  if (cacheItem) {
    timeout = 300;
  }
  request(url, {json: true, timeout: timeout}, function (err, res, body) {
    if (err && unreachable(err) && cacheItem) {
      return cb(null, cacheItem.body);
    }
    if (err) {
      return cb(err);
    }
    cache[url] = {body: body, added: +new Date()};
    return cb(null, body);
  });
}

function unreachable (err) {
  return err && ['ETIMEDOUT', 'EHOSTUNREACH', 'ECONNREFUSED'].indexOf(err.code) > -1;
}

function autoClearCache () {
  var now = +new Date();
  for (var url in cache) {
    if (cache[url] && (now - cache[url].added) > 1000 * 60 * 60 * 3) {
      cache[url] = undefined;
    }
  }
}
