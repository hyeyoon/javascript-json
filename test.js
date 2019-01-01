// const fs = require('fs');
// const files = fs.readdirSync('js');
// console.log(files);

const test = (name, fn) => {
  try {
    fn();
    console.log('\x1b[42m\x1b[30m%s\x1b[0m', 'PASS', name);
  } catch(error) {
    console.error('\x1b[41m\x1b[30m%s\x1b[0m', 'FAIL', error);
  }
}
