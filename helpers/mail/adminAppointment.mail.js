// ===== initial code =====
"use strict"

// ===== main code =====

// import all the packages
let path = require("node:path");
let fs = require("node:fs");

let processAdminAppointmentEmail = function(userName, clubName, dashboardLink) {

    let htmlFilePath = path.join(__dirname, "../../views/mail/admin-appointment.html");
    let htmlTemplate = fs.readFileSync(htmlFilePath, "utf-8");

    htmlTemplate = htmlTemplate
        .replaceAll("{{userName}}", userName)
        .replaceAll("{{clubName}}", clubName)
        .replaceAll("{{dashboardLink}}", dashboardLink || 'N/A')

    return htmlTemplate;
}

// ===== exports code =====
module.exports =  processAdminAppointmentEmail 