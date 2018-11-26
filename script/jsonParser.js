const JSONData = require('./jsonData.js');
const ErrorCheck = require('./errorCheck.js');
const Analyze = require('./analyze.js');
const Tokenize = require('./tokenize.js')

const sentence = "[{a:'tr', b :[912,[5656,33]], c:true},]".replace(/ /gi, '')

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

