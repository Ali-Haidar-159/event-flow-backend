// ===== initial code =====
"use strict"

// ===== main code =====

// import all the packages
let path = require("node:path");
let fs = require("node:fs");

let processSignupEmail = function(userName, userEmail, studentId, exploreEventsLink) {

    let htmlFilePath = path.join(__dirname, "../../views/mail/signup.html");
    let htmlTemplate = fs.readFileSync(htmlFilePath, "utf-8");

    htmlTemplate = htmlTemplate
        .replaceAll("{{userName}}", userName)
        .replaceAll("{{userEmail}}", userEmail)
        .replaceAll("{{studentId}}", studentId || 'N/A')
        .replaceAll("{{exploreEventsLink}}", exploreEventsLink);

    return htmlTemplate;
}

// ===== exports code =====
module.exports =  processSignupEmail 