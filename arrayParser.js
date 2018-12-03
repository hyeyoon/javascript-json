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

// number, boolean, string, array, object, function
const data = {
  parsedData: {
    type: '',
    child: []
  }
}
// pipe 함수
const pipe = (...functions) => args => functions.reduce((arg, nextFn) => nextFn(arg), args);

// 텍스트를 split하는 함수
const splitText = (seperator, str) => {
  return str.split(seperator)
};

// Array가 함수인지 확인하는 함수
const checkIsArray = splitList => {
  if (checker.isArray(splitList) === 'array') {
    return pipe(
      removeBracket,
      trimList
    )(splitList)
  }
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
    else console.error('숫자데이터로 이루어진 배열 형태의 문자열을 입력하세요.');
  },
  isNumber(item) {
    if (item.match(/^\d+$/)) return 'number';
    else console.error('숫자데이터로 이루어진 배열 형태의 문자열을 입력하세요.');
  }
}

// 하위 데이터를 추출하는 함수
const extractChild = (joinSeperator, splitSeperator, filteredList) => {
  // join 한 후에, 상위 , 를 기준으로 쪼개야 함
  return filteredList.join(joinSeperator).split(splitSeperator);
  // const newList = [];
  // const item = [];
  // for (let i=0; i < filteredList.length; i++) {
  //   if (i !== '[' && i!== '{' && i !== ',') {
  //     item.push(filteredList[i]);
  //   } else if (i === ',') {
  //     newList.push(item.join(''));
  //     item = [];
  //   } else if (i === '[') {
  //
  //   }
  // }
}

// 결과를 출력하는 함수
const printData = analyzedList => {
  const result = analyzedList.map(item => {
    return {
      type: checkType(item),
      value: item
    }
  })
  data.parsedData = result;
  return JSON.stringify(data.parsedData, null, 2);
}

// 타입 체크하는 함수
const checkType = token => {
  const isNumber = /^\d+$/;
  if (token.match(isNumber)) return 'number';
  else console.error('숫자데이터로 이루어진 배열 형태의 문자열을 입력하세요.');
}

// 에러 메세지 출력하는 함수
const errorMsg = () => {
  return console.error('숫자데이터로 이루어진 배열형태의 문자열을 입력하세요.');
}

const ArrayParser = pipe(
  splitText.bind(undefined, ""),
  checkIsArray,
  extractChild.bind(undefined, "", ","),
  printData,
)

const str = "[123, 22, [[256, 2]], 32]";
const result = ArrayParser(str);
console.log('result:', result);
// console.log(JSON.stringify(result, null, 2));

// { type: 'array',
//   child:
//     [ { type: 'number', value: '123', child: [] },
//      { type: 'number', value: '22', child: [] },
//      { type: 'number', value: '33', child: [] }
//     ]
// }
