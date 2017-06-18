const md5 = require('md5-file/promise');
const fs = require('fs');
const express = require('express');
const app = express();

/**
 * Taken from
 * https://stackoverflow.com/questions/25206141/having-trouble-streaming-response-to-client-using-expressjs/25206501
 */
// extracted from Express, used by `res.download()`
function contentDisposition(filename) {
  var ret = 'attachment';
  if (filename) {
    // filename = basename(filename);
    // if filename contains non-ascii characters, add a utf-8 version ala RFC 5987
    ret = /[^\040-\176]/.test(filename)
      ? 'attachment; filename="' + encodeURI(filename) + '"; filename*=UTF-8\'\'' + encodeURI(filename)
      : 'attachment; filename="' + filename + '"';
  }

  return ret;
}


app.get('/:id', (req, res) => {
  const currentPath = process.cwd();
  const filePath = currentPath + (currentPath.includes('data_source') ? '' : '/data_source') + '/public/lorem.json';
  md5(filePath).then(hash => {
    const sizeInBytes = fs.statSync(filePath).size;
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Disposition': contentDisposition('lorem.json'),
      'X-File-Size': sizeInBytes,
      'X-Hash': hash
    });
    fs.createReadStream(filePath, {'highWaterMark': 256 })
      .on('data', (chunk) => res.write(chunk))
      .on('end', (chunk) => res.end());
  });
})

app.listen(5000, () => console.log('app listening on 5000'));