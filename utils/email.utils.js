// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 
const nodemailer = require("nodemailer");
require("dotenv").config()

let smtp_details = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    family: 4
};

async function sendEmail(receiver,subject,emailBody){
    
    try {

        let transporter = nodemailer.createTransport(smtp_details)

        const info = await transporter.sendMail({
            from: `"Event Flow" <${process.env.SMTP_USER}>`, 
            to: receiver,
            subject: subject,
            html: emailBody, 
        });

        return {
            success : true,
            message : `Email sent successfully, email id : ${info.messageId}`
        }
    } 
    catch (err) {
        console.error("Email send error:", err); 
        return {
            success: false,
            message: "Email not sent",
            error: err.message
        };
    }
    
}




// exports code 

module.exports = sendEmail
