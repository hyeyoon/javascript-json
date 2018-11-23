// arrayParser step7(테스트 코드 작성) codes to test commit 2

// sum 
exports.sum = (a, b) => {
    var result = a + b;
    return result;
}

// 숫자 데이터 식별 
exports.identifyNumber = function (token) {
    if (isNaN(Number(token))) return false;
    return true;
}

// Boolean, null 데이터 식별
exports.identifyBoolean = function (token) {
    if (token !== "true" && token !== "false" && token !== "null")
        return false;
    else if (token === "true")
        return `[true, "Boolean"]`;
    else if (token === "false")
        return `[false, "Boolean"]`;
    else if (token === "null") {
        return `[null, "null"]`;
    }
    return true;
}

// 올바른 문자열 체크
exports.checkIsCorrectString = function (token) {
    if (token.startsWith("\'") &&
        token.endsWith("\'") &&
        token.match(/'/g).length == 2)
        return true;
    else return false; 
}

// 알 수 없는 타입 체크
exports.checkIsUnknownType = function (token) {
    if (!(token.startsWith("\'") || token.endsWith("\'"))) {
        return `오류를 탐지하였습니다. ${token}는 알 수 없는 타입입니다.`; 
    }
}

// 올바르지 않은 문자열 체크
exports.checkIsIncorrectString = function (token) {
    if (token.match(/'/g).length > 2 ||
        (!token.startsWith("\'") && token.endsWith("\'")) ||
        (token.startsWith("\'") && !token.endsWith("\'"))) {
        console.log(`오류를 탐지하였습니다. ${token}는 올바른 문자열이 아닙니다.`);
        return true;
    }
}

// 정상적으로 닫히지 않은 괄호 탐지
exports.checkBraceStatus = function (targetStr) {
    const checkErrorStack = [];
    const braceInfo = { "[": "]", "{": "}" };
    for (let ch of targetStr) {
        if (ch === "[" || ch === "{") checkErrorStack.push(braceInfo[ch]);
        if (ch === "]" || ch === "}") {
            if (ch === checkErrorStack[checkErrorStack.length - 1])
                checkErrorStack.pop();
            else break;
        }
    }
    if (checkErrorStack.length === 0) return false;
    else return true; 
}