// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 
let express = require("express")

let {upload} = require("../../utils/cloudinary.utils");
const { createClub, getAllClubs, getSingleClub, 
    getSearchClub, updateClub, deleteClub,
    getAllStudents, getAllAdmins } = require("../../controller/super_admin/super_admin.controller");

let superAdminRouter = express.Router() ;

superAdminRouter.post("/create-club",upload.single("profileImage"),createClub) ;
superAdminRouter.get("/all-clubs",getAllClubs);
superAdminRouter.get("/single-club",getSingleClub);
superAdminRouter.post("/search-club",getSearchClub);
superAdminRouter.put("/update-club", updateClub);
superAdminRouter.delete("/delete-club", deleteClub);
superAdminRouter.get("/all-students", getAllStudents);
superAdminRouter.get("/all-admins", getAllAdmins);



// ===== exports code ===== 

module.exports = superAdminRouter