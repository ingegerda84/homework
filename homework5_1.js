var person = {
    "name" : "Iryna",
    "surname": "Skurikhina",
    "gender": "female",
    "goal": "study JavaScript",
    
    getInfo: function() {
        for (let key in this) {
            if (typeof this[key] !== 'function') { 
                console.log(key + ": " + this[key]);
            }
            
        }
    }
};

person.getInfo();

person.age = 30;

person.getInfo();
