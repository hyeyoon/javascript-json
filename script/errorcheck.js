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
            if (innerToken === ',' && colonArr.length === 0) {
                this.printErrorMessage('object')
                return false
            }
            if (innerToken === ',') colonArr.pop()
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
        const typeObj = {
            'string': `${token}는 제대로된 문자열이 아닙니다.`,
            'number': `${token}은 알수없는 데이터입니다.`,
            'object': `올바른 객체 형태가 아닙니다.`,
            'array': `올바른 배열 형태가 아닙니다.`,
            'comma': `없는 값이 존재합니다.`,
        }
        console.log(typeObj[type])
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

module.exports = ErrorCheck