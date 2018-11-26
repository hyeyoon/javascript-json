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
        } else if (this.isColon(str)) {
            return str.slice(0, str.indexOf(':') + 1)
        } else if (this.isObjectEnd(str)) {
            return str.slice(0, str.indexOf('}'))
        } else {
            return str.slice(0, str.indexOf(','))
        }
    }

    isObjectEnd(str) {
        let ret = true
        if(str.indexOf('}') > str.indexOf(',')) ret = false
        if(str.indexOf('}') === -1) ret = false
        return ret
    }

    isColon(str) {
        let ret = true
        if(str.indexOf(':') === -1) ret = false
        if(str.indexOf(',') < str.indexOf(':')) ret = false
        return ret
    }

    isBraceOrComma(str) {
        const firLocation = str[0]
        const delimitersArr = ['[', ']', ',', '{', '}']
        const ret = delimitersArr.some(v => v === firLocation)
        return ret
    }
}

module.exports = Tokenize;