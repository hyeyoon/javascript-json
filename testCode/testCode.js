const Analyze = require('../script/analyze')
const ErrorCheck = require('../script/errorCheck.js')
const Tokenize = require('../script/tokenize')
const JSONData = require('../script/jsonData')
const errorCheck = new ErrorCheck
const analyze = new Analyze([], errorCheck)
const tokenize = new Tokenize

const checkObj = {
    value: null,

    toBe(value) {
        if (value === this.value) {
            return 'OK'
        } else {
            return `FAIL (나온 값 : ${value}, 나와야하는 값 : ${this.value})`
        }
    }
}

function expect(value) {
    checkObj.value = value
    return checkObj
}

function test(message, method) {
    console.log(`${message} : ${method()}`)
}

//test Analyze
test('객체의 key데이터인지 확인한다.', function() {
    const data = "hellow:"
    const result = analyze.isObjectKey(data)
    return expect(true).toBe(result)
})

test('데이터가 boolean타입인지 확인한다', function() {
    const data = "true"
    const result = analyze.isBoolean(data)
    return expect(true).toBe(result)
})

test('데이터가 문자열인지 확인한다.', function() {
    const data = "'test1'"
    const result = analyze.isString(data)
    return expect(true).toBe(result)
})

test('주어진 데이터queue배열이 끝날때까지 체크하며 배열이라면 배열 타입의child를 만들어 준다.', function() {
    const data = ['[']
    const result = analyze.getChild(data)[0].type
    return expect('Array').toBe(result)
})

test('주어진 데이터queue배열이 끝날때까지 체크하며 객체라면 객체 타입의 child를 만들어 준다.', function() {
    const data = ['{']
    const result = analyze.getChild(data)[0].type
    return expect('Object').toBe(result) 
})

test('주어진 데이터queue배열이 끝날때까지 체크하며 값이 객체의 키값인지 확인한후 키값을 value로 만들어 준다.', function() {
    const data = ['a:']
    const result = analyze.getChild(data)[0].value
    return expect('a').toBe(result) 
})

test('주어진 데이터queue배열이 끝날때까지 체크하며 배열이나 객체가 끝나는 괄호가 나온다면 반복문을 끝내고 배열을 반환해준다.', function() {
    const data = ['}']
    const result = analyze.getChild(data)[0]
    return expect(undefined).toBe(result) 
})

test('주어진 데이터queue배열이 끝날때까지 체크하며 boolean이라면 boolean타입의 child를 만들어 준다', function() {
    const data = ['true']
    const result = analyze.getChild(data)[0].type
    return expect('Boolean').toBe(result) 
})

test('주어진 데이터queue배열이 끝날때까지 체크하며 null 이라면 null타입의 child를 만들어 준다.', function() {
    const data = ['null']
    const result = analyze.getChild(data)[0].type
    return expect('Null').toBe(result) 
})

test('주어진 데이터queue배열이 끝날때까지 체크하며 String이라면 string타입의 child를 만들어 준다', function() {
    const data = ["'string'"]
    const result = analyze.getChild(data)[0].type
    
    return expect('String').toBe(result) 
})

test('주어진 데이터queue배열이 끝날때까지 체크하며 Number라면 Number타입의 child를 반환해 준다.', function() {
    const data = ['11']
    const result = analyze.getChild(data)[0].type
    return expect('Number').toBe(result) 
})

//test ErrorCheck
test('주어진 값이 문자열인지 확인해준다', function() {
    const data = "'test'"
    const result = errorCheck.checkString(data)
    return expect(false).toBe(result)
})

test('정해진 글자의 갯수가 몇개인지 세어준다.', function() {
    const data = "''''"
    const result = errorCheck.countLettersNum(data, "'")
    return expect(4).toBe(result)
})

test('주어진 값이 숫자인지 확인해준다.', function () {
    const data = "11"
    const result = errorCheck.checkNumber(data)
    return expect(false).toBe(result)
})

test('주어진 배열에 공백이 있는지 확인해준다.', function () {
    const data = ['11',',',',','[','11',',','12',']']
    const result = errorCheck.checkComma(data)
    return expect(false).toBe(result)
})

test('주어진 인자가 배열이면 배열이 완료되었는지 확인한다.', function() {
    const data = ['[','11','[','"st"',']','11']
    const result = errorCheck.checkBrace(data, '[',']')
    return expect(false).toBe(result)
})

test('주어진 인자가 객체면 객체가 완료되었는지 확인한다.', function() {
    const data = ['{','a:','11',']']
    const result = errorCheck.checkBrace(data, '{','}')
    return expect(false).toBe(result)
})

test('주어진 배열 내 객체값의 키가 존재하는지 확인한다.', function() {
    const data = [':']
    const result = errorCheck.checkKeys(data)
    return expect(false).toBe(result)
})

test('주어진 배열 내 객체값의 value가 존재하는지 확인한다.', function() {
    const data = ['[','{','a:','}','{',':','11','}',']']
    const result = errorCheck.checkValues(data)
    return expect(false).toBe(result)
})

test('주어진 배열내에 배열 값이 있다면 배열값은 모두 제거한다.', function() {
    const data = ['[','11',']']
    errorCheck.shiftArrayValue(data.shift(), data)
    const result = data[0]
    return expect(undefined).toBe(result)
})

test('주어진 배열값을 보고 객체데이터의 키값과 value값에 맞도록 :가 있는지 객체데이터가 끝날때까지 확인한다.', function() {
    const data = ['a:','11',',','key:','value','}']
    const result = errorCheck.checkColonNum(data);
    return expect(true).toBe(result)
})

//tokenize
test('문자열이 쉼표앞의 객체형태의 데이터가 끝나는 괄호가 있는지 확인합니다.', function() {
    const data = '},'
    const result = tokenize.isObjectEnd(data);
    return expect(true).toBe(result)
})

test('문자열이 쉼표앞의 콜론인지 확인합니다.', function() {
    const data = ':,'
    const result = tokenize.isColon(data);
    return expect(true).toBe(result)
})

test('문자열의 첫번째 글자가 괄호이거나 콤마인지 확인합니다.', function() {
    const data = ','
    const result = tokenize.isBraceOrComma(data);
    return expect(true).toBe(result)
})

test('문자열의 형태에 따라 토큰별로 나누어줍니다. "["', function() {
    const data = '[11,12,13]'
    const result = tokenize.getToken(data)
    return expect('[').toBe(result)
})

test('문자열의 형태에 따라 토큰별로 나누어줍니다. "{"', function() {
    const data = '{a:12}'
    const result = tokenize.getToken(data)
    return expect('{').toBe(result)
})

test('문자열의 형태에 따라 토큰별로 나누어줍니다. (뒤에 쉼표가 있어도) "]"', function() {
    const data = '],11,[11,12,13]'
    const result = tokenize.getToken(data)
    return expect(']').toBe(result)
})
test('문자열의 형태에 따라 토큰별로 나누어줍니다. (뒤에 쉼표가 없어도)"]"', function() {
    const data = ']'
    const result = tokenize.getToken(data)
    return expect(']').toBe(result)
})

test('문자열의 형태에 따라 토큰별로 나누어줍니다. "}"', function() {
    const data = '},[11,12,13]'
    const result = tokenize.getToken(data)
    return expect('}').toBe(result)
})

test('문자열의 형태에 따라 토큰별로 나누어줍니다. ","', function() {
    const data = ',11,12,13]'
    const result = tokenize.getToken(data)
    return expect(',').toBe(result)
})

test('문자열의 형태에 따라 토큰별로 나누어줍니다. "(key):"', function() {
    const data = 'a:11},11]'
    debugger
    const result = tokenize.getToken(data)
    return expect('a:').toBe(result)
})

test('문자열의 형태에 따라 토큰별로 나누어줍니다. "}"', function() {
    const data = '},'
    const result = tokenize.getToken(data)
    return expect('}').toBe(result)
})

test('문자열의 형태에 따라 토큰별로 나누어줍니다. (그냥 값)', function() {
    const data = '11,22,[11,22]]'
    const result = tokenize.getToken(data)
    return expect('11').toBe(result)
})

test('문장을 토큰화해서 배열에 집에 넣음.', function() {
    const data = '[11,22,{a:11},33]'
    const arrayData = tokenize.getWholeDataQueue(data)
    const expectData = ['[','11',',','22',',','{','a:','11','}',',','33',']']
    let result = true
    arrayData.forEach((v, i) => {
        if(v !== expectData[i]) {
            result = false
        }
    })
    return expect(true).toBe(result)
})