class JSONData {
    constructor(type, value, child) {
        this.type = type
        this.value = value
        this.child = child
    }
}

const sentence = "['1a'3',[22,23,[11,[112233],112],55],33]".replace(/ /gi, '')

class Tokenize {
    constructor() {
        this.wholeDataQueue = [];
    }
    
    getWholeDataQueue(sentence) {
        while(sentence.length !== 0) {
            const token = this.getToken(sentence)
            this.wholeDataQueue.push(token)
            sentence = sentence.replace(token, '')
        }
        return this.wholeDataQueue
    }

    getToken(str) {
        if (str[0] === '[' || str[0] === ',' || str[0] === ']') {
            return str.slice(0, 1)
        } else if (str.indexOf(']') < str.indexOf(',')) {
            return str.slice(0, str.indexOf(']'))
        } else if (str.indexOf(',') === -1) {
            return str.slice(0, str.indexOf(']'))
        } else {
            return str.slice(0, str.indexOf(','))
        }
    }
}

class Analyze {
    constructor(queue, errorCheck) {
        this.queueArr = queue
        this.errorCheck = errorCheck
    }
    
    queue() {
        while(this.queueArr.length !== 0) {
            const value = this.queueArr.shift()
            if(value === '[') {
                const child = this.getChild(this.queueArr, value)
                return new JSONData('Array', 'Array Object', child)
            }
        }
    }

    getChild(queueArr, checkingValue) {
        let child = [];
        while (checkingValue !== ']') {
            checkingValue = queueArr.shift()
            if(checkingValue === '[') {
                child.push(new JSONData('Array', 'Object Array', this.getChild(queueArr, checkingValue)))
                continue;
            } else if (checkingValue === ',') {
                continue;
            } else if (checkingValue === ']') {
                break;
            } else if (checkingValue === 'true' || checkingValue === 'false') {
                child.push(new JSONData('Boolean', checkingValue, []))
                continue;
            } else if (checkingValue === 'null') {
                child.push(new JSONData('Null', checkingValue, []))
                continue;
            } else if (checkingValue[0] === "'") {
                if(this.errorCheck.checkString(checkingValue)) {
                    console.log(`${checkingValue}는 제대로된 문자열이 아닙니다.`)
                    return 
                }
                child.push(new JSONData('String', checkingValue, []))
                continue;
            }
            if(this.errorCheck.checkNumber(checkingValue)) {
                console.log(`${checkingValue}은 알수없는 문자열입니다.`)
                return
            }
            child.push(new JSONData('Number', checkingValue, []))
        }
        return child
    }
}

class ErrorCheck {    
    checkString(token) {
        debugger;
        let count = 0
        for(let position = 0; position < token.length; position++) {
            if(token[position] === "'") {
                count++
            }
        }
        if(count === 2 && token[0] === "'" && token[token.length-1] === "'") {
            return false
        }
        return true
    }

    checkNumber(token) {
        if(isNaN(Number(token)) === true) {
            return true
        }
        return false
    }
}

function printJSONData(JSONData) {
    console.log(JSON.stringify(JSONData, null, 2))
}

const tokenize = new Tokenize
const tokenizedDataArr = tokenize.getWholeDataQueue(sentence)
const errorCheck = new ErrorCheck
const analyze = new Analyze(tokenizedDataArr, errorCheck)
const jsonData = analyze.queue()
printJSONData(jsonData)

