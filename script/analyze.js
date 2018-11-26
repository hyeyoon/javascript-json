const JSONData = require('./jsonData.js')

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

module.exports = Analyze