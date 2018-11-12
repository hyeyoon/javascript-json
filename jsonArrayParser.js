// arrayParser step4(여러 가지 type 분석) 

const arrayParser = {

    stack: [],

    // 문자열 해체
    separateStringByLexer(targetStr) {
        let mainBranch = {}; // 분석 결과
        let extractedString = "";
        for (let ch of targetStr) {
            if (ch === "[") {
                mainBranch = this.checkBrace(mainBranch);

            } else if ((ch === "," || ch === " ") && extractedString !== "") {
                if (this.analyzeTypeByParser(extractedString)) return;
                extractedString = "";

            } else if (ch === "]" && extractedString !== "") {
                if (this.analyzeTypeByParser(extractedString)) return;
                extractedString = "";
                this.accumulatedObj = this.stack.pop();

            } else if (ch === "]" && extractedString === "") {
                this.accumulatedObj = this.stack.pop();

            } else if ((ch === "," || ch === " ") && extractedString === "") {
                undefined;

            } else extractedString += ch; 
        }
        return mainBranch;
    },

    // 대괄호 처리
    checkBrace(mainBranch) {
        if (!mainBranch.hasOwnProperty("child")) {
            this.accumulatedObj = this.generateBranch(mainBranch);
            return mainBranch;
        } else {
            const sideBranch = {};
            this.generateBranch(sideBranch);
            this.stack.push(this.accumulatedObj);
            let accumulatedObj = this.accumulatedObj.child;
            accumulatedObj.push(sideBranch);
            this.accumulatedObj = accumulatedObj[accumulatedObj.length - 1];
            return mainBranch;
        }
    },

    // 브랜치 생성
    generateBranch(branch) {
        branch.type = 'array';
        branch.value = 'ArrayObject';
        branch.child = [];
        return branch;
    },

    // 문자열 분석
    analyzeTypeByParser(extractedString) {
        if (this.identifyNumber(extractedString)) return;
        if (this.identifyBoolean(extractedString)) return;
        if (this.identifyString(extractedString)) return true;
    },

    // 숫자 데이터 식별 
    identifyNumber(extractedString) {
        if (isNaN(Number(extractedString))) return;
        this.addDataInfo(extractedString, "number"); // 숫자면 true; 
        return true;
    },

    // Boolean, null 데이터 식별
    identifyBoolean(extractedString) {
        if (extractedString === "true") {
            return this.addDataInfo(true, "Boolean");
        }
        if (extractedString === "false") {
            return this.addDataInfo(false, "Boolean");
        }
        if (extractedString === "null") {
            return this.addDataInfo(null, "null");
        }
        return;
    },

    // 문자열 식별
    identifyString(extractedString) {
        if (this.checkErrorString(extractedString)) return true;
        this.addDataInfo(extractedString, "string");
    },

    // 문자열 오류 체크
    checkErrorString(extractedString) {
        if (extractedString.startsWith("\'") && extractedString.endsWith("\'") &&
            extractedString.match(/'/g).length == 2)
            return;
        if (!extractedString.startsWith("\'") && !extractedString.endsWith("\'")) {
            console.log(`오류를 탐지하였습니다. ${extractedString}는 알 수 없는 타입입니다. 분석을 종료합니다.`);
            return true;
        } if (extractedString.match(/'/g).length > 2 || extractedString.match(/'/g).length === 1) {
            console.log(`오류를 탐지하였습니다. ${extractedString}는 올바른 문자열이 아닙니다. 분석을 종료합니다.`);
            return true;
        }
    },

    // 각 타입에 해당하는 child 객체 생성
    addDataInfo(extractedString, type) {
        const childObj = {};
        childObj.type = type
        childObj.value = extractedString;
        childObj.child = [];
        this.accumulatedObj.child.push(childObj);
        return "added";
    },

} // end arrayParser 
console.log(JSON.stringify(arrayParser.separateStringByLexer("[10, 'apple' ,[ 20 , null,[ 30 , false , '32'], '23*6*1'], 11, 'hell'oween', 13, [22, ['33', [true] , 'iOS12.1'],23 , 'false'],14, 'theEnd' ]"), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer("[10, 'apple' ,[ 20 , null,[ 30 , false , '32'], '23*6*1'], 11, helloween, 13, [22, ['33', [true] , 'iOS12.1'],23 , 'false'],14, 'theEnd' ]"), null, 4));
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