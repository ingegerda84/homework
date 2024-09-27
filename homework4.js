function checkProbabilityTheory(count){
    if(Number.isInteger(count)){
    let evenCount = 0;
    let oddCount = 0;
    let generalCount = 0;

    for (let i = 0; i < count; i++)  {
    var number = Math.floor(Math.random() * 901) + 100
    generalCount ++;

    if (number % 2 == 0){
        evenCount ++;
    }else{
        oddCount ++;
    }
    }
    

    let evenToOddPercentage = oddCount > 0 ? Math.floor((evenCount/oddCount)*100) : 0;
    let evenToTotalPercentage = generalCount > 0 ? Math.floor((evenCount/generalCount)*100) : 0;
    let oddToTotalPercentage = generalCount > 0 ? Math.floor((oddCount/generalCount)*100) : 0;

    console.log("Кількість згенерованих чисел: " + generalCount)
    console.log("Кількість парних чисел: " + evenCount)
    console.log("Кількість непарних чисел: " + oddCount)
    console.log("Відсоток парних до непарних: " + evenToOddPercentage + "%")
    console.log("Відсоток парних до загальної кількості: " + evenToTotalPercentage + "%")
    console.log("Відсоток непарних до загальної кількості: " + oddToTotalPercentage + "%")
} else {
    console.log("Count isn't integer")
}
}


checkProbabilityTheory(100)

