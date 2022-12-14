const mongoose = require('mongoose')

const isValidName = (value) => { return (/^[A-Z a-z]+$/).test(value); }

const isValidEmail = (value) => { return (/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(value)); }

const isValidpassword = (value) => { return (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(value)); }

const isValidBody = function (value) {

    if (typeof value === "undefined" || typeof value === "null") { return false }
    if (typeof value === "string" && value.trim().length == 0) { return false }
   
    return true
}


const isValidUserName = (value) => { return (/^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/).test(value); }

const checkInputsPresent = (value) => { return (Object.keys(value).length > 0); }

const isValidMarks = (value) => { return (/^[1-9]$|^[1-9][0-9]$|^(100)$/).test(value); }

const isValidObjectId = (value) => { return mongoose.isValidObjectId(value) }



module.exports = { isValidName, isValidEmail, isValidpassword, isValidBody, checkInputsPresent, isValidUserName,isValidMarks, isValidObjectId }