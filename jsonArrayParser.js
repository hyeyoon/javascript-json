// arrayParser step5(객체 type 분석) commit 4

const ArrayParser = class {
    constructor() {
        this.accumulatedObjStack = [];
    }

    // 문자열 해체
    separateStringByLexer(targetStr) {
        this.key = "";
        let rootBranch = {}; // 최종 분석결과
        this.extractedString = ""; // 추출한 문자열 
        for (let ch of targetStr) {
            if (ch === "[" || ch === "{") {
                rootBranch = this.checkBrace(rootBranch, ch); // 새로운 브랜치 생성(괄호)
            }
            else if (this.skipCharacter(this.extractedString, ch)) continue;
            else if (this.reduceDepth(this.extractedString, ch)) continue; 
            else if (this.parseStringByType(this.extractedString, ch)) continue;
            else if (this.identifyKey(this.extractedString, ch)) continue;
            else this.extractedString += ch;
        }
        return rootBranch;
    }

    // 괄호 체크, 브랜치 생성(중괄호, 대괄호를 만날 때 마다 호출)
    checkBrace(rootBranch, ch) {
        if (!rootBranch.hasOwnProperty("child"))
            return this.generateRootBranch(rootBranch, ch);
        else return this.generateLowerBranch(rootBranch, ch);
    }

    // 루트 브랜치 생성
    generateRootBranch(rootBranch, ch) {
        this.accumulatedObj = this.composeBranchForm(rootBranch, ch);
        return rootBranch;
    }

    // 하위 브랜치 생성
    generateLowerBranch(branchType, ch) {
        const lowerBranch = {};
        this.composeBranchForm(lowerBranch, ch); // lowerBranch를 리턴한다. 
        this.accumulatedObjStack.push(this.accumulatedObj);
        let accumulatedObj = this.accumulatedObj.child;
        accumulatedObj.push(lowerBranch);
        if (!this.key) {
            this.accumulatedObj = accumulatedObj[accumulatedObj.length - 1];
        }
        if (this.key) {
            this.accumulatedObj = accumulatedObj[accumulatedObj.length - 1].value;
            this.key = undefined;
        }
        return branchType;
    }

    // 브랜치 요소 구성하기
    composeBranchForm(branchType, ch) {
        const map = { "[": "array", "{": "object" };
        if (map[ch] === "array" && !this.key)
            return this.composeObjectInfoBranch(branchType, map[ch], "object Array");
        if (map[ch] === "object" && !this.key)
            return this.composeObjectInfoBranch(branchType, map[ch], "object Object");
        if (map[ch] === "array" && this.key)
            return this.composeKeyValueBranch(branchType, this.key, map[ch], "object Array");
        if (map[ch] === "object" && this.key)
            return this.composeKeyValueBranch(branchType, this.key, map[ch], "object Object");
    }

    // 오브젝트 정보 브랜치 
    composeObjectInfoBranch(branchType, type, value) {
        branchType.type = type;
        branchType.value = value;
        branchType.child = [];
        return branchType;
    }

    // 키값 정보 브랜치
    composeKeyValueBranch(branchType, key, type, value) {
        branchType.key = key;
        branchType.value = {
            type: type,
            value: value,
            child: []
        }
        return branchType;
    }

    // 해당 문자열 건너뛰기
    skipCharacter(extractedString, ch) {
        if ((ch === "," && extractedString === "") || ch === " ") return true;
    }

    // 단계 낮추기
    reduceDepth(extractedString, ch) {
        if ((ch === "]" || ch === "}") && extractedString === "") {
            this.reduceDepthFromStack();
            this.key = undefined;
            return true;
        }
    }

    // 문자열 분석
    parseStringByType(extractedString, ch) {
        if (extractedString == "") return false;
        if ((ch === "," || ch === "]" || ch === "}") && extractedString !== "") {
            if (this.identifyNumber(extractedString, ch)) return true;
            if (this.identifyBoolean(extractedString, ch)) return true;
            if (this.identifyString(extractedString, ch)) return true;
        }
    }

    // 문자열, 키 재설정
    initializeToken(ch) { 
        this.extractedString = "";
        this.key = undefined;
        if (ch === "]" || ch === "}") {
            this.reduceDepthFromStack(); 
        }
    }

    // 스택으로부터 depth 낮추기
    reduceDepthFromStack() {
        this.accumulatedObj = this.accumulatedObjStack.pop();
    }

    // 숫자 데이터 식별 
    identifyNumber(extractedString, ch) {
        if (isNaN(Number(extractedString))) return false;
        this.accumulatedObj.child.push(this.addChildInfo(extractedString, "number")); // 숫자면 true; 
        this.initializeToken(ch);
        return true;
    }

    // Boolean, null 데이터 식별
    identifyBoolean(extractedString, ch) {
        if (extractedString !== "true" && extractedString !== "false" && extractedString !== "null")
            return false;
        if (extractedString === "true")
            this.accumulatedObj.child.push(this.addChildInfo(true, "Boolean"));
        if (extractedString === "false")
            this.accumulatedObj.child.push(this.addChildInfo(false, "Boolean"));
        if (extractedString === "null") {
            this.accumulatedObj.child.push(this.addChildInfo(null, "null"));
        }
        this.initializeToken(ch);
        return true;
    }

    // 문자열 식별
    identifyString(extractedString, ch) {
        if (this.checkErrorString(extractedString)) {
            this.accumulatedObj.child.push(this.addChildInfo(extractedString, "string"));
            this.initializeToken(ch);
        }
        return true;
    }

    // 문자열 오류 체크
    checkErrorString(extractedString) {
        if (this.checkIsCorrectString(extractedString)) return true;
        if (this.checkIsUnknownType(extractedString)) return false;
        if (this.checkIsInCorrectString(extractedString)) return false;
    }

    // 올바른 문자열 체크
    checkIsCorrectString(extractedString) {
        if (extractedString.startsWith("\'") &&
            extractedString.endsWith("\'") &&
            extractedString.match(/'/g).length == 2)
            return true;
    }

    // 알 수 없는 타입 체크
    checkIsUnknownType(extractedString) {
        if (!extractedString.startsWith("\'") && !extractedString.endsWith("\'")) {
            console.log(`오류를 탐지하였습니다. ${extractedString}는 알 수 없는 타입입니다.`);
            return true;
        }
    }

    // 올바르지 않은 문자열 체크
    checkIsInCorrectString(extractedString) {
        if (extractedString.match(/'/g).length > 2 ||
            (!extractedString.startsWith("\'") && extractedString.endsWith("\'")) ||
            (extractedString.startsWith("\'") && !extractedString.endsWith("\'"))) {
            console.log(`오류를 탐지하였습니다. ${extractedString}는 올바른 문자열이 아닙니다.`);
            return true;
        }
    }

    // 각 타입에 해당하는 child 객체 생성 
    addChildInfo(extractedString, type) {
        const childObj = {};
        if (this.key) childObj.key = this.key;
        childObj.type = type;
        childObj.value = extractedString;
        if (!this.key) childObj.child = [];
        return childObj;
    }

    // 키 식별
    identifyKey(extractedString, ch) {
        if (ch === ":") {
            this.key = extractedString;
            this.extractedString = "";
            return true;
        } else return false;
    }

} // end class

const arrayParser = new ArrayParser();


console.log(JSON.stringify(arrayParser.separateStringByLexer("{ name : 'lee', age : 33, hobby : 'photo' }"), null, 2));
console.log(JSON.stringify(arrayParser.separateStringByLexer("{info:[{ name : 'lee', age : 34, addr : 'Seoul'}, {hobby : 'photo'}, 'endArr' ], study : 'codeSquad', place : 'Gangnam-gu'}"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("['1a3',[null,false,['11',[112233],{easy : ['hello', {a:'a'}, 'world']},112],55, '99'],{a:'str', b:[912,[5656,33],{key : 'innervalue', newkeys: [1,2,3,4,5]}]}, true]"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("{x:[10,20,[30,{y:'apple'},50]]}"), null, 4)); // 
console.log(JSON.stringify(arrayParser.separateStringByLexer("[{x:'apple', y:'samsung'},10,[[[[[[true]]]]]],30]]"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("{ tree1 : { tree2 : { tree3 : { tree4 : { tree5 : { tree6 : { tree7 : { tree8 : { tree9 : { tree10 : { top : [true]}}}}}}}}}}}"), null, 2));
console.log(JSON.stringify(arrayParser.separateStringByLexer("{member1:'crong',member2:'honux',member3:'jk',member4:'pobi',a:{b:1,c:2,d:3},favorite:'milkTea',music:{genre:'rock',artist:'lifeHouse',year:2014,country:'USA'}}"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("[{a:{b:1,c:2,d:3},favorite:'milkTea'},{name:'lee',hobby:'photo'}]"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("[{x:'a', y:'b', z:'c'},{a:'x', b:'y', c:'z'}]"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("[{x:'a', y:12, z:44}, {y:'b'}, {a:1, b:2, c:3}]"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("[{x:'a', y:'b', z:'c'}, {x:'a', y:'b', z:'c'}]"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("[ { x : [1,2,3], y : [1,2,3], z : 'apple' }, 10  ]"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("[ { x : 10,  y : 20 }, 10, [20, [30], 200], 100 ]"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("[ 40, 50, 60, { name : 'lee', age : false}, 70, 80, 90, { x : [10,20,30]} ]"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("[{ x : { y : { z : { hobby : 'photo' } } } }, [10,20,30]]"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("[{ x : [10,20,{ hobby : 'photo'} ], name : 'lee' } ]"), null, 4));


console.log(JSON.stringify(arrayParser.separateStringByLexer("[10, 'apple' ,[ 20 , null,[ 30 , false , '32'], '23*6*1'], 11, 'helloween', 13, [22, ['33', [true] , 'iOS12.1'],23 , 'false'],14, 'theEnd' ]"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("[ '1a3',[ null, false,['11', [112233] , 112], 55   ,99 ], 33, true ]  "), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[1,false,\'apple\',null,5]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[\'1\',[2,true],[4,null]]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[123,[\'apple\'],33,[1,2,3,4,5]]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[10,[20,30,[40,50,60,70]]]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[10,[20,[30,[40,[50,[60,[70,[80,[90,[100]]]]]]]]]]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[[[[[[[[8]],7]]],6]]]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[10,11,[[20,21]],[[[[[[[[[true]]]]]]]]],[[22,23]]]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[10,[20,21,[30,31,32],233333],11,12,13,[22,[33,[40],34],23,24],14,15]'), null, 4));