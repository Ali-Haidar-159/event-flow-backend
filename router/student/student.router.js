// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 

let express = require("express");

const { postSignup, updateProfile, getProfile, getAllStudents, getMyRegistrations } = require("../../controller/student/student.controller");

let studentRouter = express.Router();

// all the routes 

studentRouter.post("/signup", postSignup);
studentRouter.put("/update-profile", updateProfile);
studentRouter.get("/profile", getProfile);
studentRouter.get("/all-students", getAllStudents);
studentRouter.get("/my-registrations", getMyRegistrations);



// ===== exports code ===== 

module.exports = studentRouter