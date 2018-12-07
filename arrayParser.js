/********************
 * ArrayParser
 ********************
 *  [requirements]
 *  - ArrayParser함수를 만든다.
 *  - 배열안에는 숫자데이터만 존재한다.
 *  - 배열형태의 문자열을 token단위로 해석한 후, 이를 분석한 자료구조를 만든다.
 *  - 정규표현식 사용은 최소한으로 한다.(token의 타입체크에 한해 사용가능)
 */

// 배열 여부를 확인하는 함수 추가 ([,] 로 이루어진 요소인지 확인)

// pipe 함수
const pipe = (...functions) => args => functions.reduce((arg, nextFn) => nextFn(arg), args);

// 텍스트를 split하는 함수
const splitText = (str) => {
  return str.split("")
};

// Array가 함수인지 확인하는 함수
const checkIsArray = splitList => {
  if (checker.isArray(splitList) === 'array') {
    return pipe(
      removeBracket,
      trimList
    )(splitList)
  } else console.error('배열형태의 문자열을 입력해주세요.');
};

// 대괄호를 제외한 리스트를 리턴하는 함수
const removeBracket = arrayList => {
  return arrayList.slice(1,-1)
};

// 배열 중 공백을 제외한 token을 리턴하는 함수
const trimList = list => {
  return list.filter(item => item !== " ")
};

// 변수 타입 확인하는 함수
const checker = {
  isArray(item) {
    if (item[0] === '[' && item[item.length - 1] === ']') return 'array';
  },
  isNumber(item) {
    if (item.match(/^\d+$/)) return 'number';
  },
  isComma(item) {
    if (item === ',') return 'comma';
  }
}

const tokenizeList = (splitList) => {
  let tmp = '';
  const newList = [];
  let calcArrBrackets = 0;
  splitList.forEach(token => {
    if (checker.isComma(token) && calcArrBrackets === 0) {
      tmp && newList.push(tmp);
      tmp = ''
    } else if (token === ']' && calcArrBrackets === 0) {
      tmp += token;
      newList.push(tmp);
      tmp = ''
    } else {
      token === '[' && ++calcArrBrackets;
      token === ']' && --calcArrBrackets;
      tmp += token;
    }
  })
  tmp && newList.push(tmp);
  return newList;
}

const parseData = (splitList) => {
  return splitList.reduce(parseReducer, makeChild('array', 'ArrayObject'))
}

const parseReducer = (prev, curr) => {
  if (checker.isArray(curr)) {
    prev.child.push(ArrayParser(curr))
  } else {
    prev.child.push(makeChild('number', curr));
  }
  return prev
}

const makeChild = (type, value) => {
  return {
    type: type,
    value: value,
    child: [],
  }
}

const ArrayParser = pipe(
  splitText,
  checkIsArray,
  tokenizeList,
  parseData,
)

const str = "[123,[22],33, [1,[2, [3]], 4, 5]]";
const result = ArrayParser(str);
console.log('result:', JSON.stringify(result, null, 2));

// { type: 'array',
//   child:
//     [ { type: 'number', value: '123', child: [] },
//      { type: 'number', value: '22', child: [] },
//      { type: 'number', value: '33', child: [] }
//     ]
// }
