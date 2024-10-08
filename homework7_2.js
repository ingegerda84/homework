function validateString(arr) {
    const stringPattern = /^[^aA]{5}/;
    let listOfValidStrings = arr.filter(item => stringPattern.test(item));
    return listOfValidStrings
}

var arr = ['Happiness', 'Time', 'Task', 'Apple', 'Wonderful', 'Joyful'];

console.log(validateString(arr))