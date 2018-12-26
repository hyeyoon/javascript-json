// pipe 함수
const pipe = (...functions) => args => functions.reduce((arg, nextFn) => nextFn(arg), args);

// 텍스트를 split하는 함수
const splitText = (str) => str.split("");

const validateType = data => {
  if (checker.isArray(data) || checker.isObject(data)) return data
  else throw Error (`배열 혹은 객체 형태의 데이터를 입력해주세요.`)
}

// Array가 함수인지 확인하는 함수
// const checkIsArray = splitList => {
//   if (checker.isArray(splitList) === 'array') splitList;
//   else console.error('배열형태의 문자열을 입력해주세요.');
// };

// 처음과 끝을 제외한 결과를 리턴하는 함수
const removeBracket = item => item.slice(1,-1);

// 배열 중 공백을 제외한 token을 리턴하는 함수
const trimList = list => list.filter(item => item !== " ");

const checkIsComma = item => {
  if (item === ',') return true;
};

const checkIsColon = item => {
  if (item === ':') return true;
}

// 변수 타입 확인하는 함수
const checker = {
  isArray(item) {
    if (item[0] === '[' && item[item.length - 1] === ']') return 'array';
    else if (item[0] === '[' || item[item.length - 1] === ']') {
      throw Error(`정상적으로 종료되지 않은 배열이 있습니다.`);
    };
  },
  isObject(item) {
    if (item[0] === '{' && item[item.length - 1] === '}') return 'object';
    else if (item[0] === '{' || item[item.length - 1] === '}') {
      throw Error(`정상적으로 종료되지 않은 객체가 있습니다.`);
    };
  },
  isNumber(item) {
    if (item.match(/^\d+$/)) return 'number';
  },
  isNull(item) {
    if (item.match(/^null$/)) return 'null';
  },
  isBoolean(item) {
    if (item.match(/^(true|false)$/)) return 'boolean';
  },
  isString(item) {
    if (item.match(/^(['"]).*?\1$/)) {
      if (item.slice(1, -1).match(/['"]/)) {
        throw Error(`${item}은 올바른 문자열이 아닙니다.`);
      } else {
        return 'string'
      }
    };
  },
  isUnknownType(item) {
    throw Error(`${item}은 알 수 없는 타입입니다.`);
  }
}

const typeChecker = item => {
  for (let type in checker) {
    let typeResult = checker[type](item);
    if (typeResult) return typeResult;
  }
}

export { pipe, splitText, validateType, removeBracket, checkIsComma, checkIsColon, checker, typeChecker }
