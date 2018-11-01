// arrayParser step3(무한 중첩된 배열구조) 

const arrayParser = {

    stack: [],

    separateStringByLexer(targetStr) {
        let mainBranch = {}; // 분석 결과
        let extractedNum = "";
        for (let ch of targetStr) {
            if (ch === "[") {
                mainBranch = this.checkBrace(mainBranch);
            }
            if (!isNaN(Number(ch))) { // 숫자형식의 문자열을 인식하여 추출
                extractedNum += ch;

            } else if (ch === "," && extractedNum !== "") { // 분석할 문자열을 추출한 경우 ','를 만나면 분석 메소드 호출
                this.analyzeStringByParser(extractedNum);
                extractedNum = "";

            } else if (ch === "]" && extractedNum !== "") { // 분석할 문자열을 추출한 경우 ']'를 만나면 분석 메소드 호출
                this.analyzeStringByParser(extractedNum);
                extractedNum = "";
                this.accumulatedObj = this.stack.pop();

            } else if (ch === "]" && extractedNum === "") { // 분석할 문자열이 없는 경우
                this.accumulatedObj = this.stack.pop();
            }
        }
        return mainBranch;
    },

    checkBrace(mainBranch) {
        if (!mainBranch.hasOwnProperty("child")) {
            return this.initializeMainBranch(mainBranch);
        } else {
            this.addSideBranch();
            return mainBranch;
        }
    },

    initializeMainBranch(mainBranch) {
        this.accumulatedObj = {};
            mainBranch.type = 'array';
            mainBranch.value = 'ArrayObject';
            mainBranch.child = [];
        this.accumulatedObj = mainBranch;
        return mainBranch;
    },

    addSideBranch() {
        const sideBranch = {};
            sideBranch.type = 'array';
            sideBranch.value = 'ArrayObject';
            sideBranch.child = [];

        this.stack.push(this.accumulatedObj);

        let accumulatedObj = this.accumulatedObj.child;
        accumulatedObj.push(sideBranch);
        this.accumulatedObj = accumulatedObj[accumulatedObj.length - 1];
    },

    analyzeStringByParser(extractedNum) {
        const childObj = {};
            childObj.type = typeof Number(extractedNum);
            childObj.value = extractedNum;
            childObj.child = [];

        this.accumulatedObj.child.push(childObj);
    },

} // end arrayParser 

console.log(JSON.stringify(arrayParser.separateStringByLexer('[1,2,3,4,5]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[1,[2,3],[4,5]]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[123,[22],33,[1,2,3,4,5]]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[10,[20,30,[40,50,60,70]]]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[10,[20,[30,[40,[50,[60,[70,[80,[90,[100]]]]]]]]]]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[[[[[[[[8]],7]]],6]]]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[10,11,[[20,21]],[[[[[[[[[90]]]]]]]]],[[22,23]]]'), null, 4));
console.log(JSON.stringify(arrayParser.separateStringByLexer('[10,[20,21,[30,31,32],233333],11,12,13,[22,[33,[40],34],23,24],14,15]'), null, 4));