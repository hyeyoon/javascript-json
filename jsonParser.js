class JSONData {
    constructor(type, value, child) {
        this.type = type
        this.value = value
        this.child = child
    }
}

const array = "[123,[22, 33],44,[1,2,3], 11]".replace(/ /gi, '')

function ArrayParser(array) {
    const WholeDataQueue = [];
    while (array.length !== 0) {
        debugger;
        //토큰 자르고 토큰wholeDataqueue 에 넣고
        const token = getToken(array)
        queuePusher(token, WholeDataQueue)
        array = array.replace(token, '')
    }
    return analyzeQueue(WholeDataQueue)
}
function getToken(string) {
    //, [ or ]가 나오면 따로뽑아냄
    if (string[0] === '[' || string[0] === ',' || string[0] === ']') {
        return string.slice(0, 1)
    } else if (string.indexOf(']') < string.indexOf(',')) {
        return string.slice(0, string.indexOf(']'))
    } else if (string.indexOf(',') === -1) {
        return string.slice(0, string.indexOf(']'))
    } else {
        return string.slice(0, string.indexOf(','))
    }
}
function queuePusher(token, queue) {
    queue.push(token)
    return queue
}
function queueShifter(queue) {
    return queue.shift()
}
function analyzeQueue(queue) {
    debugger;
    while (queue.length !== 0) {
        const value = queueShifter(queue)
        if (value === '[') {
            const child = getChild(queue, value)
            return new JSONData('array', 'array Object', child)
        }
    }
}
function getChild(queue, valueIn) {
    let child = []
    while (valueIn !== ']') {
        let valueIn = queueShifter(queue)
        if (valueIn === '[') {
            child.push(new JSONData('Array', 'object Array', getChild(queue, valueIn)))
            continue;
        } else if (valueIn === ',') {
            continue;
        } else if (valueIn === ']') {
            break;
        }
        child.push(new JSONData('Number', valueIn, []))
    }
    return child
}
function printJSONData(JSONData) {
    console.log(JSON.stringify(JSONData, null, 2))
}

printJSONData(ArrayParser(array))