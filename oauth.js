/**
 * Created by wjh on 2015/4/17.
 */
var qs = require('querystring');
var util = require('./util.js');
var config = require ('./config.js').config;

function request_token() {

    var src = config.server + "/open/requestToken";
    var param = qs.stringify({ oauth_consumer_key: config.consumer_key, oauth_nonce: util.random_num(), oauth_signature_method : 'HMAC-SHA1', oauth_timestamp: util.current_time(),oauth_version : '1.0' });

    var sign = util.signature("GET", src ,param, config.consumer_secret);

    var address = src + "?" + param + "&oauth_signature=" + sign;
    util.debug(src);
    util.debug(param);
    util.debug(address);
}

exports.request_token = request_token;
