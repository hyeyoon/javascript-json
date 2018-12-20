/********************
 * ArrayParser
 ********************
 */

import { pipe, splitText, checkIsArray, removeBracket, checkIsComma, checkIsColon, checker, typeChecker } from './utility.js';

const tokenizeChecker = {
  isEnd (token, arrStatus, objStatus) {
    if (checkIsComma(token) && arrStatus === 0 && objStatus === 0) return true;
  },
  isClosed (token, arrStatus, objStatus) {
    if ((token === ']' && arrStatus === 0) || (token === '}' && objStatus === 0)) return true;
  },
  isObjKey (token, type, objStatus) {
    if (token === ':' && type === 'object' && objStatus === 0) return true;
  },
}

const addDataToItem = (type, data) => {
  if (type === 'array') {
    data.tmp && data.newItem.push(data.tmp.trim());
  } else {
    data.newItem[data.tmpKey] = data.tmp.trim();
  }
  data.tmp = '';
  data.tmpKey = '';
}

const tokenizeList = (splitList) => {
  const removedBracketList = removeBracket(splitList);
  const type = typeChecker(splitList);
  const tokenizeData = {
    newItem: (type === 'array') ? [] : {},
    tmp: '',
    tmpKey: '',
  };
  let [calcArrBrackets, calcObjBrackets] = [0, 0];
  removedBracketList.forEach(token => {
    if (tokenizeChecker.isEnd(token, calcArrBrackets, calcObjBrackets)) {
      addDataToItem(type, tokenizeData);
    } else if (tokenizeChecker.isClosed(token, calcArrBrackets, calcObjBrackets)) {
      tokenizeData.tmp += token;
      addDataToItem(type, tokenizeData);
    } else if (tokenizeChecker.isObjKey(token, type, calcObjBrackets)) {
      tokenizeData.tmpKey = tokenizeData.tmp.trim();
      tokenizeData.tmp = '';
    } else {
      token === '[' && ++calcArrBrackets;
      token === ']' && --calcArrBrackets;
      token === '{' && ++calcObjBrackets;
      token === '}' && --calcObjBrackets;
      tokenizeData.tmp += token;
    }
  })
  addDataToItem(type, tokenizeData);
  return tokenizeData.newItem;
}

const parseData = (splitList, initialValue = makeChild('ArrayObject', 'array')) => {
  return splitList.reduce(parseReducer, initialValue)
}

const parseReducer = (prev, curr) => {
  if (checker.isArray(curr)) {
    prev.child.push(arrayParser(curr))
  }
  else if (checker.isObject(curr)) {
    prev.child.push(makeChild('ObjectObject', 'object'));
    const currentItem = prev.child[prev.child.length - 1];
    pipe(
      splitText,
      tokenizeList,
      parseObject.bind(null, currentItem)
    )(curr)
  }
  else {
    prev.child.push(pipe(
      typeChecker,
      makeChild.bind(null, curr)
    )(curr));
  }
  return prev
}

const makeChild = (value, type, key) => {
  if (key) {
    return {type: type, objectKey: key, objectValue: value, value: []};
  }
  else {
    return {type: type, value: value, child: []};
  }
}

const arrayParser = pipe(
  splitText,
  tokenizeList,
  parseData,
)

const parseObject = (currentParseData, curr) => {
  let index = 0
  for (let key in curr) {
    currentParseData.child.push(makeChild(curr[key], typeChecker(curr[key]), key));
    if (typeChecker(curr[key]) === 'array') {
      currentParseData.child[index].value = (arrayParser(curr[key]))
    } else if (typeChecker(curr[key]) === 'object') {
      pipe(
        splitText,
        tokenizeList,
        parseObject.bind(null, currentParseData.child[index])
      )(curr)
    }
    index++;
  }
}

// const str = "[123,[22],'asd asd', [1,[2, [3]], 4, 5]]";
const str = "['1a3',[null,false,['11',[112233],{easy : ['hello', {a:'a'}, 'world']},112],55, '99'],{a:'str', b:[912,[5656,33],{key : 'innervalue', newkeys: [1,2,3,4,5]}]}, true]"
const result = arrayParser(str);
console.log('result:', JSON.stringify(result, null, 2));
