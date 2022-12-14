const jwt = require("jsonwebtoken")

const userModel = require("../models/userModel");

const validator = require("../validator/validator");

const Authentication = async (req, res, next) => {
    try {

        //===================== Check Presence of Key with Value in Header =====================//
        let token = req.headers['authorization']
        token = token.slice(7)
        if (!token) { return res.status(400).send({ status: false, message: "Token must be Present." }) }
        
        //===================== Verify token & asigning it's value in request body =====================//
        jwt.verify(token, "created by mohd fayeem", function (error, decodedToken) {
            if (error) {
                return res.status(401).send({ status: false, message: "Invalid Token." })
            } else {
                req.token = decodedToken
                next()
            };
        })

    } catch (error) {

        res.status(500).send({ status: false, error: error.message })
    }
}

const Authorization = async (req, res, next) => {

    try {

        //===================== Authorising with userId From Param =====================//
        let userId = req.params.userId;

        //===================== Checking the userId is Valid or Not by Mongoose =====================//
        if (!validator.isValidObjectId(userId)) return res.status(400).send({ status: false, message: `This UserId: ${userId} is not valid!` })

        //===================== Fetching All User Data from DB =====================//
        let userData = await userModel.findById(userId)
        if (!userData) return res.status(404).send({ status: false, message: "User Does Not Exist" })

        //x===================== Checking the userId is Authorized Person or Not =====================x//
        if (userData['_id'].toString() !== req.token.payload.userId) {
            return res.status(403).send({ status: false, message: "Unauthorized User Access!" })
        }
        next()

    } catch (error) {

        res.status(500).send({ status: false, error: error.message })
    }
}

//================================= Module Export ==============================================//

module.exports = { Authentication, Authorization }