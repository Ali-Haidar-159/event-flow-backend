// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 
let bcrypt = require("bcrypt")

let SALT_ROUNDS = 10

async function encryptData(data) {
    try {
        const hash = await bcrypt.hash(data, SALT_ROUNDS);
        return {
            success: true,
            data: hash
        };
    } 
    catch (err) {
        return {
            success: false,
            error: "Failed to encrypt the data."
        };
    }
}


function compareEncryptData(mainData,comparableData){
    bcrypt.compare(mainData,comparableData,function(err,result){

        if(err){
            return {
                success : false ,
                error : "find error to compare the data"
            }
        }
        else
        {
            return {
                success : true
            }
        }

    })
}



// ===== exports code ===== 

module.exports = {
    encryptData ,
    compareEncryptData
}
