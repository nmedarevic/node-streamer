const md5 = require('md5-file/promise');
const http = require('http');
const fs = require('fs');
const filePath = './public/lorem-dl.json';
const writeStream = fs.createWriteStream(filePath);

const clearEvents = (emmitters) => emmitters.forEach(emmitter => emmitter.removeAllListeners());

const md5Cb = (res, writeStream) => (hash) => {
  if (hash === res.headers['x-hash']) {
    writeStream.end(() => {
      clearEvents([writeStream, res]);
      console.log('Hash good');
    });
    
  } else {
    console.log('Bad hash')
  }
};

const statCb = (res, filePath, writeStream) => (err, data) => {
  if(data.size === Number(res.headers['x-file-size'])) {
    md5(filePath).then(md5Cb(res, writeStream));
  }
}

const writeCb = (chunk, res, writeStream) => () => fs.stat(filePath, statCb(res, filePath, writeStream));

http.request({
  method: 'GET',
  host: 'localhost',
  port: '5000',
  path: '/lorem.json'
}, (res) => {
  res.on('data', (chunk) => writeStream.write(chunk, writeCb(chunk, res, writeStream)));
  res.on('err', (err) => console.log(err));
}).end();