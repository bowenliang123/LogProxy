'use strict';
const url = require('url');
const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});


//内部依赖
let configs = require('./conf/configs.json');
let demoRules = require('./demoRules.json');

//代理端口,默认为9999
let proxyPort = (configs['default_proxy_port']) ? configs['default_proxy_port'] : 9999;

//获取检查用例
let testCases = demoRules.testCases;

proxy.on('error', function (e) {
    console.log('proxy error:');
    console.log(e);
});

const server = http.createServer((req, res) => {
    console.log(req.url);
    let parsedUrl = url.parse(req.url, true);
    let query = parsedUrl.query;
    testCases.forEach((testCase)=> {
        if (testCase.type == 'click') {
            let value = testCase.value;

            if (query['ck_id'] == value) {
                console.log('hit click rule: ' + testCase.desc);
            }
        }
    });

    proxy.web(req, res, {
        target: parsedUrl.protocol + '//' + req.headers.host
    });
});
server.listen(proxyPort);
