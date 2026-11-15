// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 
let express = require("express") ;

const { postEventRegister, verifyAndCompletePayment, getMyRegistrations } = require("../../controller/regsitration/registration.controller");

// all the routers 

let eventRegistrationRouter = express.Router();

eventRegistrationRouter.post("/event-register", postEventRegister);
eventRegistrationRouter.post('/verify-payment', verifyAndCompletePayment);
eventRegistrationRouter.get('/my-registrations', getMyRegistrations);

// ===== exports code ===== 

module.exports = eventRegistrationRouter