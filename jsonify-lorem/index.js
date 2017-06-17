const readline = require('readline');
const fs = require('fs');

const childProcess = require('child_process');

let jsonLorem = {};
let numberOfLines = 0;
let splitted = null;

const rl = readline.createInterface({
  input: fs.createReadStream('lorem.txt')
});

rl.on('line', (line) => {
  if (line.length > 0) {
    splitted = [line.slice(0, line.length / 2), line.slice(line.length / 2, line.length)];
    splitted.forEach(line => jsonLorem[Object.keys(jsonLorem).length] = line);
  }
}).on('close', () => {
  fs.writeFile('./lorem.json', JSON.stringify(jsonLorem), () => {
    childProcess.exec(`start "" ${process.cwd() + '\\lorem.json'}`);
  })
});