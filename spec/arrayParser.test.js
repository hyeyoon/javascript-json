import { tokenizeChecker, addDataToItem, tokenizeList, parseData, parseReducer, makeChild, arrayParser, parseObject } from '../js/arrayParser';
import { test, expect } from '../test';

test('token값이 ","이고 객체와 배열이 모두 닫힌 상태이면 true를 반환한다.', () => {
  // given
  const token = ',';
  const arrStatus = 0;
  const objStatus = 0;
  // when
  const isEnd = tokenizeChecker.isEnd(token, arrStatus, objStatus);
  // then
  expect(isEnd).toBeTruthy();
})

test('value, type 값을 넘기면 해당 값을 갖고 있는 객체를 반환한다.', () => {
  // given
  const value = 'Hello';
  const type = 'string';
  // when
  const child = makeChild(value, type);
  // then
  expect(child).toBe({type: type, value: value, child: []});
})

test('최소한의 토큰 단위로 쪼개진 배열을 입력하면 의미있는 토큰으로 묶은 배열을 반환한다.', () => {
  // given
  const data = ['[', '1', '2', '3', ',', '4', '5', ']'];
  // when
  const tokenizedList = tokenizeList(data);
  // then
  expect(tokenizedList).toBe(['123', '45']);
})

test('tokenize된 리스트를 입력하면 이를 분석한 자료구조 객체를 반환한다.', () => {
  // given
  const data = ['123', '45'];
  // when
  const parsedData = parseData(data);
  // then
  expect(parsedData).toBe({
    type: "array",
    value: "ArrayObject",
    child: [
      {
        type: "number",
        value: "123",
        child: []
      },
      {
        type: "number",
        value: "45",
        child: []
      }
    ]
  });
})
