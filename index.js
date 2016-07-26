'use strict';


const url = require('url');
const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});



//内部依赖
let configs = require('./conf/configs.json');
let demoRules = require('./data/demoRules.json');
const RuleChecker=require('./app/ruleChecker');

//代理端口,默认为9999
let proxyPort = (configs['default_proxy_port']) ? configs['default_proxy_port'] : 9999;

//获取检查用例
let testCases = demoRules.testCases;

//代理服务错误监听
proxy.on('error', function (e) {
    // console.log('proxy error:');
    // console.log(e);
});

let ruleChecker = new RuleChecker(testCases);

//用于对外作为HTTP代理服务器
const server = http.createServer((req, res) => {
    // console.log(req.url);


    //执行检查
    ruleChecker.check(req.url);


    //执行代理请求
    let parsedUrl = url.parse(req.url, true);   //解析请求
    proxy.web(req, res, {
        target: parsedUrl.protocol + '//' + req.headers.host
    });
});

//log
console.log(`listening on port ${proxyPort}`);
server.listen(proxyPort);
