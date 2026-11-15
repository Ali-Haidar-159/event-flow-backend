// ===== initial code =====

"use strict";

// ===== main code =====

// import all the packages
const express = require("express");
const { postLogin, postLogout, getMe } = require("../../controller/student/auth.controller");

const authRouter = express.Router();

// all the routes
authRouter.post("/login", postLogin);
authRouter.post("/logout", postLogout);
authRouter.get("/logout", postLogout);
authRouter.get("/me", getMe);

// ===== exports code =====

module.exports = authRouter;