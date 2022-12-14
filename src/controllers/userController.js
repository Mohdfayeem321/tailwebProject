const userModel = require("../models/userModel");

const jwt = require("jsonwebtoken");

const validator = require("../validator/validator")

const bcrypt = require("bcrypt");

const saltRounds = 10;

// ============================ Creating User ======================================= //

const createUser = async function (req, res) {
    try {

        let data = req.body;
        
        let { name, email, password, userName, ...rest } = data;

        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: " you have to put details to create user" });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "you have to put only name, password, email and userName" }) }
        
        if (!validator.isValidBody(name)) { return res.status(400).send({ status: false, message: 'Please enter name' }) }
        if (!validator.isValidName(name)) { return res.status(400).send({ status: false, message: 'name should be in alphabets' }) }
        
        if (!validator.isValidBody(userName)) { return res.status(400).send({ status: false, message: 'Please enter the userName' }) }
        if (!validator.isValidUserName(userName)) { return res.status(400).send({ status: false, message: 'Please enter valid userName' }) }
        
        
        if (!validator.isValidBody(email)) { return res.status(400).send({ status: false, message: 'Please enter emailId' }) }
        if (!validator.isValidEmail(email)) { return res.status(400).send({ status: false, message: 'Please enter valid emailId' }) }
        
        
        if (!validator.isValidBody(password)) { return res.status(400).send({ status: false, message: 'Please enter password' }) }
        if (!validator.isValidpassword(password)) { return res.status(400).send({ status: false, message: "To make strong Password, it should be use 8 to 15 Characters which including letters, atleast one special character and one Number." }) }

        //===================== Encrept the password by thye help of Bcrypt =====================//
        data.password = await bcrypt.hash(password, saltRounds);

        const isDuplicateEmail = await userModel.findOne({ $or: [{ email: email }, { userName: userName }] })
        if (isDuplicateEmail) {
            if (isDuplicateEmail.email == email) { return res.status(400).send({ status: false, message: `This EmailId: ${email} is already exist!` }) }
            if (isDuplicateEmail.userName == userName) { return res.status(400).send({ status: false, message: `This userName : ${userName} is already exist!` }) }
        }
        
        let user = await userModel.create(data);
        return res.status(201).send({ status: true, data: user })

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}


//=================================== User Login ===================================//

const userLogin = async function (req, res) {
    try {

        let data = req.body;
        
        let { email, userName, password } = data;

        let obj = {};

        if(userName){
        if (!validator.isValidBody(userName)) { return res.status(400).send({ status: false, message: 'Please enter the UserName' }) }
        if (!validator.isValidUserName(userName)) { return res.status(400).send({ status: false, message: 'Please enter valid userName' }) }
        obj["userName"] = userName;
        }
        
        if(email){
        if (!validator.isValidBody(email)) { return res.status(400).send({ status: false, message: 'Please enter the EmailId' }) }
        if (!validator.isValidEmail(email)) { return res.status(400).send({ status: false, message: 'Please enter valid emailId' }) }
        obj["email"] = email;
        }

        if (!validator.isValidBody(password)) return res.status(400).send({ status: false, message: "Password required to login" })
        if (!validator.isValidpassword(password)) { return res.status(400).send({ status: false, message: "Invalid Password Format! Password Should be 8 to 15 Characters and have a mixture of uppercase and lowercase letters and contain one symbol and then at least one Number." }) }
        
        let checkEmail = await userModel.findOne({ $or: [{ email: email }, { userName: userName }] })
        
        if (!checkEmail) { return res.status(401).send({ status: false, message: "Invalid Login Credentials! You need to register first." }) }

        //===================== Decrypt the Password and Compare the password with User input =====================//
        let checkPassword = await bcrypt.compare(password, checkEmail.password)

        obj["password"] = checkPassword;

        let payload = {
            userId: checkEmail['_id'].toString(),
            Project: "tailWebProject",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 60
        }

        const token = jwt.sign({ payload }, "created by mohd fayeem");

        let userIdAndToken = { userId: checkEmail['_id'], token: token }
        
        req.token = token;

        return res.status(200).send({ status: true, data: userIdAndToken });

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}

module.exports = { createUser, userLogin }