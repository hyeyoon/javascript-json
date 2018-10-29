// arrayParser step2(2중 중첩 배열 분석) modified 1

const arrayParser = {

    // 분석된 문자열 데이터(줄기)
    stem: [],

    // 배열의 깊이(-1부터 시작)
    depth: -1,


    checkDataType(targetStr, ch) {
        if (!(ch === "[" && targetStr[0] === '[' && targetStr[targetStr.length - 1] === ']')) return;
        this.depth++;
        this.stem[this.depth] = {};
        this.stem[this.depth].child = [];
        this.stem[this.depth].type = 'array';
        this.stem[this.depth].value = 'ArrayObject';

    },

    // 문자열 해체 메소드
    getAnalyzedStem(targetStr) {
        let extractedNum = "";
        for (let ch of targetStr) {
            
            this.checkDataType(targetStr, ch);

            if (!isNaN(Number(ch))) { // 숫자형식의 문자열을 인식하여 추출
                extractedNum += ch;
                targetStr = targetStr.replace(ch, "");

            } else if (ch === "," && extractedNum !== "") { // 분석할 문자열을 추출한 경우 ','를 만나면 분석 메소드 호출
                this.analyzeStr(extractedNum);
                extractedNum = "";

            } else if (ch === "]" && extractedNum !== "") { // 분석할 문자열을 추출한 경우 ']'를 만나면 분석 메소드 호출
                this.analyzeStr(extractedNum);
                extractedNum = "";
                this.depth--;

            } else if (ch === "]" && extractedNum === "") { // 분석할 문자열이 없는 경우 : ex( ]] )
                this.depth--;
            }
        }
        return this.printArrayStem(this.stem); // 분석 결과 출력 메소드
    },

    // 추출 문자열 분석 메소드
    analyzeStr(extractedNum) {
        const childObj = {};
        childObj.type = typeof Number(extractedNum);
        childObj.value = extractedNum;
        childObj.child = [];
        this.stem[this.depth].child.push(childObj);
    },

    // 분석 결과 출력 메소드
    printArrayStem(stem) {
        for (let i = stem.length - 1; i > 0; i--) {
            stem[i - 1].child.push(stem[i]);
        }
        return stem;
    }

} // end arrayParser 

// 분석 대상 문자열 데이터
let targetStr = '[123,[22,23,[11,[112233],112],55],33]]';
//let targetStr = '[1,2,3,4,5,[6]]'
//let targetStr = '[10,[20,30,[40,50,60,70]]]';
//let targetStr = '[10,[20,[30,[40,[50,[60,[70,[80,[90,[100]]]]]]]]]]';

let analyzedStem = arrayParser.getAnalyzedStem(targetStr)[0];
console.log(JSON.stringify(analyzedStem, null, 4));