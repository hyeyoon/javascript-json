const test = (name, fn) => {
  try {
    fn();
    console.log('\x1b[42m\x1b[30m%s\x1b[0m', 'PASS', name);
  } catch(error) {
    console.error('\x1b[41m\x1b[30m%s\x1b[0m', 'FAIL', error);
  }
}

const expect = targetValue => {
  return {
    toBe(expectValue) {
      if (JSON.stringify(targetValue) === JSON.stringify(expectValue)) return true;
      else throw `targetValue(${targetValue})값과 expectValue(${expectValue})값이 일치하지 않습니다.`;
    },
    toBeTruthy() {
      if (targetValue) return true;
      else throw `targetValue(${targetValue})의 값이 true를 반환하지 않습니다.`;
    },
    toBeFalsy() {
      if (!targetValue) return true;
      else throw `targetValue(${targetValue})의 값이 falsy한 값을 반환하지 않습니다.`;
    },
  }
}

export { test, expect }
