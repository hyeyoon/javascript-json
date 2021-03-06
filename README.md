# Array Parser

## STEP1. Array 데이터 분석

## 요구사항

* ArrayParser함수를 만든다.
* 배열안에는 숫자데이터만 존재한다.
* 배열형태의 문자열을 token단위로 해석한 후, 이를 분석한 자료구조를 만든다.
* 정규표현식 사용은 최소한으로 한다.(token의 타입체크에 한해 사용가능)

## 실행결과

```
var str = "[123, 22, 33]";
var result = ArrayParser(str);console.log(JSON.stringify(result, null, 2));
```

## STEP2. 2중 중첩 배열 분석

## 요구사항

* 배열안에 배열이 있는 경우도 분석한다.

> var s = "[123,[22],33]";

* 중첩된 배열 원소도 역시, 숫자데이터만 존재한다.
* 중첩된 결과는 child 부분에 추가해서 결과가 표현돼야 한다.

## 실행결과

```
var str = var s = "[123,[22],33, [1,2,3,4,5]]";
var result = ArrayParser(str);console.log(JSON.stringify(result, null, 2));
//배열안의 배열 같은경우, 다음과 같이 표현될 수 있다(예시)
{ type: 'array', value: ArrayObject, child: [{type:'number', value:22, child:[]}] }
```

## STEP3. 무한 중첩된 배열구조 / STEP4. 여러가지 Type 대응

## 요구사항

* 무한중첩 구조도 동작하게 한다. [[[[[]]]]]
* 배열의 원소에는 숫자타입만 존재한다.
* 복잡한 세부로직은 함수로 분리해본다.
* 중복된 코드역시 함수로 분리해서 일반화한다.
* 프로그래밍 설계를 같이 PR한다.
* hint : 중첩문제를 풀기 위해 stack구조를 활용해서 구현할 수도 있다.

## 실행결과

```
var str = "[123,[22,23,[11,[112233],112],55],33]";var result = ArrayParser(str);
console.log(JSON.stringify(result, null, 2));
//중첩된 배열을 분석했음으로, 결과 역시 중첩된 객체형태이다.
```


## 설계

1. 일시적으로 요소를 저장하는 tmp 와 그룹화한 새로운 배열을 저장할 newList 선언
2. 배열의 시작과 끝을 파악하기 위해 calcArrBrackets 변수를 만들고, 해당 변수에 '['을 만나면 +1, ']'를 만나면 -1을 처리해서 합이 0이 되었을 때 해당 배열이 끝난 것으로 판단
3. 토큰 리스트를 순환
    1. token이 ','일 경우 tmp가 있을 때 tmp를 새로운 배열에 추가하고 tmp데이터 비운다.
    2. token이 ']'이고, 종료된 배열이면 tmp에 token 추가 후, 새로운 배열에 tmp 데이터 추가, tmp 데이터 비운다.
    3. 그 외 상황일 경우 tmp에 token을 추가
        1. token이 '['일 경우 배열 시작 상황 추가
        2. token이 ']'일 경우 배열 종료 상황 추가
4. 분석을 마친 토큰 데이터들을 원하는 데이터 형태로 파싱
    1. 파싱 중 배열 데이터를 만난 경우 3번의 작업으로 돌아가서 반복
    2. 숫자 데이터의 경우 파싱을 끝내고 객체 추가

## STEP5. 객체 Type

## 요구사항

* Object 타입 ( { key: value} ) 도 지원한다.
* 배열안에 object, object안에 배열이 자유롭게 포함될 수 있다.
* 지금까지의 코드를 리팩토링한다.
  * 복잡한 세부로직은 반드시 함수로 분리해본다.
  * 최대한 작은 단위의 함수로 만든다.
  * 중복된 코드역시 함수로 분리해서 일반화한다.
  * 객체형태의 class로 만든다.

## 설계

1. STEP3, STEP4에서 만든 tokenizeList 함수를 객체 타입도 분석할 수 있돌록 수정
2. 객체 타입의 경우 아래와 같은 형식으로 표현되도록 구현
```
input = [{easy : ['hello', {a:'a'}, 'world']}];
result = {
  "type": "object",
  "value": "ObjectObject",
  "child": [
    {
      "type": "array",
      "objectKey": "easy",
      "objectValue": "['hello', {a:'a'}, 'world']",
      "value": {
        "type": "array",
        "value": "ArrayObject",
        "child": [
          {
            "type": "string",
            "value": "'hello'",
            "child": []
          },
          {
            "type": "object",
            "value": "ObjectObject",
            "child": [
              {
                "type": "string",
                "objectKey": "a",
                "objectValue": "'a'",
                "value": []
              }
            ]
          },
          {
            "type": "string",
            "value": "'world'",
            "child": []
          }
        ]
      }
    }
```
  1. arrayParser에서 분석 결과가 array일 때는 arrayParser를 재귀 호출
  2. 분석 결과가 object일 때는 parseObject 함수 호출을 통해 객체 분석
    1. parseObject의 분석 결과가 array일 경우 다시 arrayParser를 통해 분석
    2. 분석 결과가 object일 때는 parseObject로 분석
    3. 그 외의 결과는 타입 분석
  3. 그 외의 결과는 타입 분석


## STEP6. 오류상황 탐지

## 요구사항
* 배열이나 객체가 제대로 닫히지 않았는지 체크하는 부분을 추가한다.
* 객체안에 colon이 누락된 경우가 있는지 체크한다.
* 그 외 엄격한 검사 로직을 1개 추가하고 이를 검증하는 코드를 구현한다.

## 실행결과
```javascript
var s = "['1a3',[null,false,['11',112,'99'], {a:'str', b:[912,[5656,33]]}, true]";
var result = ArrayParser(str);
//정상출력

var s = "['1a3',[null,false,['11',112,'99' , {a:'str', b:[912,[5656,33]]}, true]";
var result = ArrayParser(str);
// 정상적으로 종료되지 않은 배열이 있습니다.

var s = "['1a3',[null,false,['11',112,'99'], {a:'str', b: [912,[5656,33]], true]";
var result = ArrayParser(str);
// 정상적으로 종료되지 않은 객체가 있습니다.

var s = "['1a3',[null,false,['11',112,'99'], {a:'str', b  [912,[5656,33]]}, true]";
var result = ArrayParser(str);
// ':'이 누락된 객체표현이 있습니다.
```

## 설계
* 배열이나 객체가 제대로 닫히지 않았는지 체크하는 부분을 추가한다.
  - tokenizeList 함수에서 array와 object의 brackets 상태를 보고 체크
* 객체안에 colon이 누락된 경우가 있는지 체크한다.
  - 객체가 내부에 있는 경우, colon을 누락했는지 확인하는 코드 추가
* 그 외 엄격한 검사 로직을 1개 추가하고 이를 검증하는 코드를 구현한다.
  - 기존 타입 검사하는 함수를 활용해서 addDataToItem 함수에서 타입 검증 과정 추가.

## STEP7. 테스트 코드 작성

## 요구사항
* 테스트 가능한test함수와 expect.toBe메서드를 만든다.
* test함수와 expect객체 그리고 toBe메서드는 별도의 자바스크립트 파일로 만들고, 이를 export/require를 통해서 nodeJS환경에서 테스트 할 수 있어야 한다.

## 실행결과
```
두 개의 서로다른 양의 정수의 합이 올바르게 나온다  : OK
양의 정수와 음의 정수의 합이 올바르게 나온다 : FAIL (targetValue is 10, expectValue is 0)
```

## 설계
* spec 폴터 내부에 각 자바스크립트 파일에 대한 테스트 파일을 생성한다.
* 테스트 함수인 test함수, expect객체 toBe, toBeTruthy, toBeFalsy 메서드를 test.js 파일에 생성한다.
* run.js에서 각 테스트 파일을 불러와서 실행할 수 있도록 한다.  
* babel과 nodemon 설치로 터미널 환경에서 테스트를 구동할 수 있도록 한다.

## 실행방법
  - repository를 다운로드 혹은 clone 한다.
  - ```npm install```을 터미널에 입력해서 필요한 node modules 설치
  - ```npm run test```를 입력해서 테스트 실행

## 실행결과

![테스트 예제](./images/test_example.png)
