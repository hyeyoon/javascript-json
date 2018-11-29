/********************
 * ArrayParser
 ********************
 *  [requirements]
 *  - ArrayParser함수를 만든다.
 *  - 배열안에는 숫자데이터만 존재한다.
 *  - 배열형태의 문자열을 token단위로 해석한 후, 이를 분석한 자료구조를 만든다.
 *  - 정규표현식 사용은 최소한으로 한다.(token의 타입체크에 한해 사용가능)
 */

// number, boolean, string, array, object, function
const data = {
  seperator: '',
  parsedData: {
    type: '',
    child: []
  }
}
// pipe 함수
const pipe = (...functions) => args => functions.reduce((arg, nextFn) => nextFn(arg), args);

// 텍스트를 seperator 기준으로 split하는 함수
const splitText = str => str.split(data.seperator);

const ArrayParser = pipe(
  splitText,
)


var str = "[123, 22, 32]";
var result = ArrayParser(str);
console.log('result:', result);
// console.log(JSON.stringify(result, null, 2));

// { type: 'array',
//   child:
//     [ { type: 'number', value: '123', child: [] },
//      { type: 'number', value: '22', child: [] },
//      { type: 'number', value: '33', child: [] }
//     ]
// }
