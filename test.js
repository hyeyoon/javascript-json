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

const expect = value => {
  return {
    toBe(expect) {
      if (JSON.stringify(value) === JSON.stringify(expect)) return true;
      else throw Error(`${value}값과 ${expect}값이 일치하지 않습니다.`);
    }
  }
}

export { test, expect }
