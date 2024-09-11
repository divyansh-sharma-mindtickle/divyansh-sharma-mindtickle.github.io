/* eslint-disable no-console */

require('dotenv').config();

  

const https = require('http');

  

const accesslog = require('access-log');

const httpProxy = require('http-proxy');

const HttpProxyRules = require('http-proxy-rules');

  

const proxyRules = new HttpProxyRules({

rules: {

'/new/ui': `https://localhost:${process.env.DEV_SERVER_PORT}/new/ui`,

'/assets-ui': `https://localhost:${process.env.DEV_SERVER_PORT}/assets-ui`,

'/([0-9a-z]+).hot-update': `https://localhost:${process.env.DEV_SERVER_PORT}/$1.hot-update.json`,

},

default: process.env.BASE_PATH,

});

  

const proxy = httpProxy.createProxy();

const port = process.env.PROXY_PORT;

  

https

.createServer((req, res) => {

let target = proxyRules.match(req);

console.log('target:---', target);

accesslog(req, res);

return proxy.web(req, res, {

changeOrigin: true,

target: target,

headers: {

'x-forwarded-host': process.env.BASE_PATH.split('//')[1],

'x-host': req.headers.host,

},

secure: false,

});

})

.listen(port, err => {

if (err) {

return console.log('something bad happened', err);

}

console.log(`server is listening on ${port}`);

});