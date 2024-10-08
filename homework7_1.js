var arr = [
    {
        userName:"Test",
        lastName:"Test",
        email:"test.test@gmail.com"
    },
    {
        userName:"Dmitro",
        lastName:"Porohov",
        email:"dmitro.porohov@yahoo.com"
    },
    {
        userName:"Andrii",
        lastName:"",
        email:"andrii@mail.ru" // Нам такі не підходять
    },
];

function validateEmail( arr) {
    const emailPattern = /^[a-zA-Z0-9.]+@(gmail\.com|yahoo\.com)$/;
    let listOfValidEmails = arr.filter(item => emailPattern.test(item.email)).map(item => item.email);
    return listOfValidEmails
}

console.log(validateEmail(arr))