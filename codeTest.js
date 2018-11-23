// arrayParser step7(테스트 코드 작성) commit 3
const importedObj = require('./jsonArrayParser.js');

// CodeTest class
const CodeTest = class {
    constructor() {
        this.arrayParser = importedObj.arrayParser
    }
    // test 메소드
    testCodes(testRequirement, operateTest) {
        console.log(testRequirement);
        operateTest();
    }

    // test 결과 출력
    showTestResult(codesToTest, targetValue) {
        const expectValue = codesToTest;
        if (expectValue === targetValue) {
            console.log(`'OK' \n ============`);
            return;
        } else {
            console.log(`'FAIL'( targetValue is ${targetValue}, expectValue is ${expectValue}) \n ============`);
            return;
        }
    }
} // end class

// 객체 생성
const codeTest = new CodeTest();

// 오류 탐지 메시지 출력
codeTest.testCodes("복수의 인자를 받아 메시지를 출력하고 true를 리턴한다.", () => {
    const args = [":", "object"];
    codeTest.showTestResult(
        codeTest.arrayParser.errorDetector.printCatchedErrorMsg(...args)
        , true);
});

// 올바른 문자열 체크
codeTest.testCodes("올바른 문자열인 경우 true를 리턴한다.", () => {
    const token = "\'apple\'";
    codeTest.showTestResult(
        codeTest.arrayParser.checkIsCorrectString(token)
        , true);
});

// 알 수 없는 타입 체크
codeTest.testCodes("따옴표가 없는 문자열인 경우 오류 메시지를 출력하고 true를 리턴한다.", () => {
    const token = "apple"
    codeTest.showTestResult(
        codeTest.arrayParser.checkIsUnknownType(token)
        , true);
});

// 올바르지 않은 문자열 체크
codeTest.testCodes("올바르지 않은 문자열인 경우 메시지를 출력하고 true를 리턴한다.", () => {
    const token = "\'apple"
    codeTest.showTestResult(
        codeTest.arrayParser.checkIsIncorrectString(token)
        , true);
});


// 정상적으로 닫히지 않은 괄호 탐지
codeTest.testCodes("정상적으로 닫하지 않은 배열인 경우 메시지를 출력하고 true를 리턴한다", () => {
    const targetStr = "[{key : 'value'}, [10, 20, 30]"
    codeTest.showTestResult(
        codeTest.arrayParser.errorDetector.checkBraceStatus(targetStr)
        , true);
});

codeTest.testCodes("정상적으로 닫하지 않은 배열인 경우 메시지를 출력하고 true를 리턴한다", () => {
    const targetStr = "[{key : 'value'}], [10, 20, 30]"
    codeTest.showTestResult(
        codeTest.arrayParser.errorDetector.checkBraceStatus(targetStr)
        , true);
});

// 숫자 데이터 식별 
codeTest.testCodes("token이 숫자 데이터가 아닌 경우 false를 리턴한다.", () => {
    const token = "apple"; ch = "]";
    codeTest.showTestResult(
        codeTest.arrayParser.identifyBoolean(token, ch)
        , false);
});

// Boolean, null 데이터 식별
codeTest.testCodes("token이 'true', 'false', 'null'이 아닌 경우 false를 리턴한다.", () => {
    const token = "apple"; ch = "]";
    codeTest.showTestResult(
        codeTest.arrayParser.identifyBoolean(token, ch)
        , false);
});

// 토큰 생성
codeTest.testCodes("추출한 문자열이 존재하고 분석할 문자열이 빈 칸인 경우 추출한 문자열로 token을 생성하여 리턴한다.", () => {
    const extractedString = "apple"; ch = " ";
    codeTest.showTestResult(
        codeTest.arrayParser.generateToken(extractedString, ch)
        , "apple");
});