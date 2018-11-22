class JSONData {
    constructor(type, value, child) {
        this.type = type
        this.value = value
        this.child = child
    }
}
const sentence = "['1a3',null,false,['11',112,'99'], {a:'tr', b :[912,[5656,33]], c:true}, true]".replace(/ /gi, '')

class Tokenize {
    constructor() {
        this.wholeDataQueue = [];
    }

    getWholeDataQueue(sentence) {
        while (sentence.length !== 0) {
            const token = this.getToken(sentence)
            this.wholeDataQueue.push(token)
            sentence = sentence.replace(token, '')
        }
        return this.wholeDataQueue
    }

    getToken(str) {
        if (this.isBraceOrComma(str)) {
            return str.slice(0, 1)
        } else if (str.indexOf(']') < str.indexOf(',')) {
            return str.slice(0, str.indexOf(']'))
        } else if (str.indexOf(',') === -1) {
            return str.slice(0, str.indexOf(']'))
        } else if (str.indexOf(':') !== -1 && str.indexOf(',') > str.indexOf(':')) {
            return str.slice(0, str.indexOf(':') + 1)
        } else if (str.indexOf('}') < str.indexOf(',') && str.indexOf('}') !== -1) {
            return str.slice(0, str.indexOf('}'))
        } else {
            return str.slice(0, str.indexOf(','))
        }
    }

    isBraceOrComma(str) {
        const firLocation = str[0]
        const delimitersArr = ['[', ']', ',', '{', '}']
        const ret = delimitersArr.some(v => v === firLocation)
        return ret
    }
}

class Analyze {
    constructor(queue, errorCheck) {
        this.queueArr = queue
        this.errorCheck = errorCheck
    }

    queue() {
        while (this.queueArr.length !== 0) {
            const value = this.queueArr.shift()
            if (value === '[') {
                return this.makeArrayChild(this.queueArr, value)
            } else if (value === '{') {
                return this.makeObjectChild(this.queueArr, value)
            }
        }
    }

    makeArrayChild(queueArr, value) {
        const arrayChild = this.getChild(queueArr, value)
        return new JSONData('Array', 'Array Object', arrayChild)
    }

    makeObjectChild(queueArr) {
        const objectChild = this.getChild(queueArr, value)
        return new JSONData('Object', 'Object Object', objectChild)
    }

    getChild(queueArr, checkingValue) {
        let child = [];
        while (queueArr.length !== 0) {
            checkingValue = queueArr.shift()
            if (checkingValue === ',') {
                continue;
            } else if (checkingValue === '[') {
                child.push(new JSONData('Array', 'Object Array', this.getChild(queueArr, checkingValue)))
                continue;
            } else if (checkingValue === '{') {
                child.push(new JSONData('Object', 'Object Object', this.getChild(queueArr, checkingValue)))
                continue;
            } else if (this.isObjectKey(checkingValue)) {
                child.push(new JSONData('object key', checkingValue.slice(0, checkingValue.indexOf(':')), []))
                continue;
            } else if (checkingValue === '}' || checkingValue === ']') {
                break;
            } else if (this.isBoolean(checkingValue)) {
                child.push(new JSONData('Boolean', checkingValue, []))
                continue;
            } else if (checkingValue === 'null') {
                child.push(new JSONData('Null', checkingValue, []))
                continue;
            } else if (this.isString(checkingValue)) {
                if (this.errorCheck.checkString(checkingValue)) return
                child.push(new JSONData('String', checkingValue, []))
                continue;
            }
            if (this.errorCheck.checkNumber(checkingValue)) return
            child.push(new JSONData('Number', checkingValue, []))
        }
        return child
    }

    isObjectKey(value) {
        return value.indexOf(':') !== -1
    }

    isBoolean(value) {
        return value === 'true' || value === 'false'
    }

    isString(value) {
        return value[0] === "'"
    }
};

class ErrorCheck {
    countLettersNum(token, letter) {
        let lettersNum = 0
        for (let position of token) {
            if (position === letter) {
                lettersNum++
            }
        }
        return lettersNum
    }

    checkString(token) {
        let quotesNum = this.countLettersNum(token, "'")
        if (quotesNum === 2 && token[0] === "'" && token[token.length - 1] === "'") {
            return false
        }
        this.printErrorMessage('string', token)
        return true
    }

    checkNumber(token) {
        if (isNaN(Number(token))) {
            this.printErrorMessage('number', token)
            return true
        }
        return false
    }

    checkComma(wholeDataQueue) {
        const copiedWholeDataQueue = wholeDataQueue.map(v => v)
        while(copiedWholeDataQueue.length !== 0) {
            const letter = copiedWholeDataQueue.shift()
            if(letter === ',' && copiedWholeDataQueue[0] === ',') {
                this.printErrorMessage('comma')
                return false
            }
        }
        return true
    }

    checkBrace(wholeDataQueue, brace, closeBrace) {
        const copiedWholeDataQueue = wholeDataQueue.map(v => v)
        let braceNum = 0
        while (copiedWholeDataQueue.length !== 0) {
            const token = copiedWholeDataQueue.shift()
            if (token === brace) {
                braceNum++
                continue
            }
            if (token === closeBrace) {
                braceNum--
                continue
            }
        }
        if (braceNum !== 0) {
            if (brace === '[') this.printErrorMessage('array')
            if (brace === '{') this.printErrorMessage('object')
            return false
        }
        return true
    }

    checkObject(wholeDataQueue) {
        const copiedWholeDataQueue = wholeDataQueue.map(v => v)
        while (copiedWholeDataQueue.length !== 0) {
            const token = copiedWholeDataQueue.shift()
            if (token === '{') {
                if (!this.checkKeys(copiedWholeDataQueue)) return false
                if (!this.checkValues(copiedWholeDataQueue)) return false
            }
        }
        return true
    }

    checkKeys(wholeDataQueue) {
        if (wholeDataQueue[0] === ':') {
            this.printErrorMessage('object')
            return false
        }//check key
        return true
    }

    checkValues(wholeDataQueue) {
        while (true) {
            const innerToken = wholeDataQueue.shift()
            if (innerToken.indexOf(':') !== -1) {
                if (wholeDataQueue[0] === '}' || wholeDataQueue[0] === ',') {
                    this.printErrorMessage('object')
                    return false
                }
            }
            if (innerToken === '}') break;
        }//check value
        return true
    }

    checkObjectColon(wholeDataQueue) {
        const copiedWholeDataQueue = wholeDataQueue.map(v => v)
        while (copiedWholeDataQueue.length !== 0) {
            let token = copiedWholeDataQueue.shift()
            if (token === '{') {
                if(!this.checkColonNum(copiedWholeDataQueue)) return false
            }
        }
        return true
    }

    checkColonNum(wholeDataQueue) {
        const colonArr = [];
        while (true) {
            let innerToken = wholeDataQueue.shift()
            this.shiftArrayValue(innerToken, wholeDataQueue)
            if (innerToken.indexOf(':') !== -1) colonArr.push(':')
            if (innerToken === ',') {
                if (colonArr.length === 0) {
                    this.printErrorMessage('object')
                    return false
                }
                colonArr.pop()
            }
            if (innerToken === '}') break;
        }
        if (colonArr.length !== 1) {
            this.printErrorMessage('object')
            return false
        }
        return true
    }

    shiftArrayValue(innerToken, wholeDataQueue) {
        if (innerToken === '[') {
            while (true) {
                let letter = wholeDataQueue.shift()
                if (letter === ']') break;
            }
        }
    }

    printErrorMessage(type, token) {
        if (type === 'string') console.log(`${token}는 제대로된 문자열이 아닙니다.`)
        if (type === 'number') console.log(`${token}은 알수없는 데이터입니다.`)
        if (type === 'object') console.log(`올바른 객체 형태가 아닙니다.`)
        if (type === 'array') console.log(`올바른 배열 형태가 아닙니다.`)
        if (type === 'comma') console.log(`없는 값이 존재합니다.`)
    }
    
    checkAllData(wholeDataQueue) {
        if(!this.checkBrace(wholeDataQueue, '[', ']')) return false
        if(!this.checkBrace(wholeDataQueue, '{', '}')) return false
        if(!this.checkObject(wholeDataQueue)) return false
        if(!this.checkObjectColon(wholeDataQueue)) return false
        if(!this.checkComma(wholeDataQueue)) return false
        return true
    }
};

const print = function printJSONData(JSONData) {
    console.log(JSON.stringify(JSONData, null, 2))
}

const errorCheck = new ErrorCheck(sentence)
const tokenize = new Tokenize(sentence)
const tokenizedDataArr = tokenize.getWholeDataQueue(sentence)
if (errorCheck.checkAllData(tokenizedDataArr)) {
    const analyze = new Analyze(tokenizedDataArr, errorCheck)
    const jsonData = analyze.queue()
    print(jsonData)
}

