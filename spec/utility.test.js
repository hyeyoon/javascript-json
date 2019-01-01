import { splitText, errorMsg, validateIsArrayOrIsObject, removeBracket, checkIsComma, checkIsColon, checker, typeChecker } from '../js/utility';
import { test, expect } from '../test';

test('텍스트를 입력했을 때 각 문자열로 이루어진 배열이 출력된다.', () => {
  // given
  const inputString = 'Hello';
  // when
  const splittedText = splitText(inputString);
  // then
  expect(splittedText).toBe(['H', 'e', 'l', 'l', 'o']);
})

test('입력된 문자열 데이터가 배열 또는 객체 타입이 아닐 경우 입력된 데이터를 반환한다.', () => {
  // given
  const data = "['a', 'b', 'c']";
  // when
  const checkDataType = validateIsArrayOrIsObject(data);
  // then
  expect(checkDataType).toBe(data);
})

test('데이터를 입력하면 데이터의 시작과 끝을 제외한 값을 반환한다.', () => {
  // given
  const data = "Hello";
  // when
  const slicedData = removeBracket(data);
  // then
  expect(slicedData).toBe("ell");
})

test('입력된 데이터가 ","일 경우 true를 반환한다.', () => {
  // given
  const data = ',';
  // when
  const checker = checkIsComma(data);
  // then
  expect(checker).toBeTruthy();
})

test('입력된 데이터가 ":"일 경우 true를 반환한다.', () => {
  // given
  const data = ':';
  // when
  const checker = checkIsColon(data);
  // then
  expect(checker).toBeTruthy();
})

test('문자화된 데이터를 입력하면 데이터의 타입을 반환한다.', () => {
  // given
  const data = "123";
  // when
  const checker = typeChecker(data);
  // then
  expect(checker).toBe('number');
})

test('상황에 따른 에러 메세지를 반환한다.', () => {
  // given
  const errorStatus = "objectFail";
  // when
  const msg = errorMsg[errorStatus];
  // then
  expect(msg).toBe('정상적으로 종료되지 않은 객체가 있습니다.');
})
