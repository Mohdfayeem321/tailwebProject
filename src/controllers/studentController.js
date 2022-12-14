const studentModel = require("../models/studentModel");

const userModel = require("../models/userModel");

const validator = require("../validator/validator")

const createStudent = async function (req, res) {
    try {

        let data = req.body;

        let { name, subject, marks, userId, ...rest } = data;

        if (userId !== req.token.payload.userId) {
            return res.status(403).send({ status: false, message: "Unauthorized User Access!" })
        }

        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "you have to put data to create student details" });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "you can put only name, subject, marks and userId" }) }


        if (!validator.isValidBody(name)) { return res.status(400).send({ status: false, message: 'Please enter name' }) }
        if (!validator.isValidName(name)) { return res.status(400).send({ status: false, message: 'name should be valid' }) }


        if (!validator.isValidBody(subject)) { return res.status(400).send({ status: false, message: 'Please enter subject' }) }
        if (!validator.isValidName(subject)) { return res.status(400).send({ status: false, message: 'subject should be valid' }) }

        if (!validator.isValidBody(marks)) { return res.status(400).send({ status: false, message: 'Please enter marks' }) }
        if (!validator.isValidMarks(marks)) { return res.status(400).send({ status: false, message: 'marks should be valid' }) }

        if (typeof marks != "number") {
            return res.status(400).send({ status: false, message: "please enter marks in number form only, not string" })
        }

        if (!validator.isValidObjectId(userId)) return res.status(400).send({ status: false, message: `This UserId: ${userId} is not valid!` })


        let checkUserExist = await userModel.findById(userId);

        if (!checkUserExist) return res.status(404).send({ status: false, message: "user doesn't exist" })

        let checkStudent = await studentModel.findOne({ name: name, subject: subject });
        if (!checkStudent) {

            let student = await studentModel.create(data);
            return res.status(201).send({ status: true, data: student })
        }
        else {
            let existMarks = checkStudent.marks;
            let newMarks = existMarks + marks;
            let updateMarks = await studentModel.findOneAndUpdate({ name: name, subject: subject, userId:userId }, { $set: { marks: newMarks } }, { new: true });

            if(!updateMarks) return res.status(400).send({ status: false, message: "student already exist but you are not authorised to update thier marks" })
            return res.status(200).send({ status: true, data: updateMarks });
        }

    } catch (error) {

        return res.status(500).send({ status: false, error: error.message })
    }
}

const getStudent = async function (req, res) {
    try {
        let data = req.query;

        let userId = req.params.userId;

        let { name, subject, ...rest } = data;

        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "you can do filters only name and subject" }) }

        let existUser = await userModel.findById(userId);

        if (!existUser) return res.status(404).send({ status: false, message: "user don't have students data or user doesn't exist" })

        let obj = {}

        if (name) {
            obj["name"] = { $regex: name }
        }
        if (subject) {
            obj["subject"] = { $regex: subject }
        }

        obj["userId"] = userId;

        let student = await studentModel.find(obj)

        if (student.length == 0) return res.status(404).send({ status: false, message: "there is no student matched with this filter or no data found for this user " })

        return res.status(200).send({ status: true, data: student })
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }

}


const updateStudent = async function (req, res) {

    try {

        let data = req.body;

        let userId = req.params.userId;

        let updateObj = {};

        let { name, subject, studentId, marks, ...rest } = data;


        if (!validator.checkInputsPresent(data)) return res.status(400).send({ status: false, message: "you have to put data to update student details" });
        if (validator.checkInputsPresent(rest)) { return res.status(400).send({ status: false, message: "you can put only name, subject, marks and studentId" }) }

        if (!studentId) return res.status(400).send({ status: false, message: "please enter studentId to update details" })

        if (!validator.isValidObjectId(studentId)) return res.status(400).send({ status: false, message: `This studentId: ${studentId} is not valid!` });

        if (name) {

            if (!validator.isValidBody(name)) { return res.status(400).send({ status: false, message: 'Please enter name' }) }

            if (!validator.isValidName(name)) { return res.status(400).send({ status: false, message: 'name should be valid' }) }

            updateObj["name"] = name;
        }

        if (subject) {

            if (!validator.isValidBody(subject)) { return res.status(400).send({ status: false, message: 'Please enter subject' }) }

            if (!validator.isValidName(subject)) { return res.status(400).send({ status: false, message: 'subject should be valid' }) }

            updateObj["subject"] = subject;
        }

        if (marks) {

            if (!validator.isValidBody(marks)) { return res.status(400).send({ status: false, message: 'Please enter marks' }) }

            if (!validator.isValidMarks(marks)) { return res.status(400).send({ status: false, message: 'marks should be valid' }) }

            if (typeof marks != "number") {
                return res.status(400).send({ status: false, message: "please enter marks in number form only, not string" })
            }
            updateObj["marks"] = marks;
        }


        let updateStudent = await studentModel.findOneAndUpdate({ userId: userId, _id: studentId, isDeleted: false }, { $set: updateObj }, { new: true });

        if (!updateStudent) return res.status(404).send({ status: false, data: "there is no data found to update! Please check userId or studentId, or maybe it deleted" })

        return res.status(200).send({ status: true, message:"updated successfully", data: updateStudent })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }

}


const deleteStudent = async function (req, res) {

    let data = req.body;

    let userId = req.params.userId;

    let { name, studentId, ...rest } = data;

    let obj = {};

    let restLen = Object.keys(rest);

    if (restLen.length > 0) return res.status(400).send({ status: false, message: "please put name or studentId to delete details" })

    if (name) {
        obj["name"] = name;
    }

    if (studentId) {
        obj["_id"] = studentId;
    };

    obj["userId"] = userId;

    obj["isDeleted"] = false;

    let deleted = await studentModel.findOneAndUpdate(obj, { isDeleted: true, deletedAt: Date.now() }, { new: true });

    if (!deleted) { return res.status(404).send({ status: false, message: "student is not found or Already Deleted!" }) }

    return res.status(200).send({ status: true, message: "student details Successfully Deleted." })
}

module.exports = { createStudent, getStudent, updateStudent, deleteStudent }