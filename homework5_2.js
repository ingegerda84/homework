var services = {
    "стрижка": "60 грн",
    "гоління": "80 грн",
    "Миття голови": "60 грн",

    getNumberFromSevice(key){
    return Number(services[key].split(' ')[0])
    },

    getPrice: function() {
        let totalPrice = 0

        for (let key in this) {
            if (typeof this[key] === 'string'){
            let price =this.getNumberFromSevice(key)
            totalPrice +=price
        }
        }

        return totalPrice
    },

    minPrice(){
        let listOfPrice = []

        for (let key in this) {
            if (typeof this[key] === 'string'){
            let price =this.getNumberFromSevice(key)
            listOfPrice.push(price)
            }
        }
        return Math.min(...listOfPrice)
    },

    minPriceAlternative(){
        let listOfPrice = []
        let minPrice = null

        for (let key in this) {
            if (typeof this[key] === 'string'){
            let price =this.getNumberFromSevice(key)

            if(minPrice === null || price < minPrice){
                minPrice = price
            }
            }
        }
        return minPrice
    },

    maxPrice(){
        let listOfPrice = []

        for (let key in this) {
            if (typeof this[key] === 'string'){
            let price =this.getNumberFromSevice(key)
            listOfPrice.push(price)
            }
        }
        return Math.max(...listOfPrice)
    },

    maxPriceAlternative(){
        let listOfPrice = []
        let maxPrice = null

        for (let key in this) {
            if (typeof this[key] === 'string'){
            let price =this.getNumberFromSevice(key)

            if(maxPrice === null || price > maxPrice){
                maxPrice = price
            }
            }
        }
        return maxPrice
    },
};

// console.log(services.getPrice())
// console.log(services.minPrice())
// console.log(services.maxPrice())
// services["Poзбите скло"] = "200 грн"
// console.log(services.getPrice())
// console.log(services.minPrice())
// console.log(services.maxPrice()
console.log(services.minPriceAlternative())
console.log(services.maxPriceAlternative())