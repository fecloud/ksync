/**
 * Created by Feng OuYang on 2014-07-08.
 */
var http = require('http');
var https = require('https');
var crypto = require('crypto');
var qs = require('querystring');
var log4js = require('log4js');

log4js.configure({
    appenders: [
        //{ type: 'file', filename: '/var/log/httpd/' + start_module + '.log', category: 'default' },
      { type: 'console', category: 'default' },
    ]
});


//普通日志
var logger = log4js.getLogger('default');
logger.setLevel('DEBUG');


Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

/**
 * 格式化时间
 * @returns {*}
 */
function format_time() {

    return new Date().format("yyyy-MM-dd hh:mm:ss.S");

}

exports.format_time = format_time;

/**
 * 获取当前时间
 */
function current_time() {

    return parseInt(new Date().getTime() / 1000);

}

exports.current_time = current_time;


/**
 * https get
 * @param url
 * @param sucess
 * @param error
 */
function https_get(url, sucess, error) {

    https.get(url,function (res) {
        debug("https_get url:" + url + " statusCode: ", res.statusCode);
//       util.debug("headers: ", res.headers);

        res.on('data', function (d) {
            if (sucess != undefined) {
                sucess.call(sucess, d);
            }
        });

    }).on('error', function (e) {
        if (error != undefined) {
            error.call(error, e);
        }
        error(e);
    });

}

exports.https_get = https_get;

/**
 * http get
 * @param url
 * @param sucess
 * @param error
 */
function http_get(url, sucess, error) {

    http.get(url,function (res) {
        debug("http_get url:" + url + " statusCode:", res.statusCode);
//        debug("headers: ", res.headers);

        res.on('data', function (d) {
            if (sucess != undefined) {
                sucess.call(sucess, d);
            }
        });

    }).on('error', function (e) {
        if (error != undefined) {
            error.call(error, e);
        }
        error(e);
    });

}

exports.http_get = http_get;

/**
 * 字符串md5
 * @param string
 * @returns {*}
 */
function md5String(string) {

    var md5 = crypto.createHash('md5');
    md5.update(string);
    return md5.digest('hex');

}

exports.md5_string = md5String;

/**
 * 产生随机数
 * @returns {Number}
 */
function random_num() {

  return  parseInt(Math.random() * 10000000)

}

exports.random_num = random_num;

function signature(method, src, param, consumer_secret, oauth_token_secret) {

    var base_string = method + "&" + encodeURIComponent(src) + "&" + encodeURIComponent(param);
    debug(base_string);
    var key = consumer_secret + "&";
    if (oauth_token_secret) {
        key = key + oauth_token_secret;
    }
    var sign = crypto.createHmac('sha1', key).update(base_string).digest().toString('base64');

    debug(sign);
    return sign;

}

exports.signature = signature;

function trace(message) {

    logger.trace(message);

}

exports.trace = trace;


function debug(message) {

    logger.debug(message);

}

exports.debug = debug;

function info(message) {

    logger.info(message);

}

exports.info = info;

function warn(message) {

    logger.warn(message);

}

exports.warn = warn;

function error(message) {

    logger.error(message);

}

exports.error = error;

function fatal(message) {

    logger.fatal(message);

}

exports.fatal = fatal;

