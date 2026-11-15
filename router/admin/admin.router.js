// ===== initial code =====

"use strict"

// ===== main code =====
// import all the packages 
let express = require("express");

let {upload} = require("../../utils/cloudinary.utils") ;
const { createEvent, getAllEvents, getSingleEvent, 
    getSearchEvent, updateEvent, deleteEvent } = require("../../controller/admin/admin.controller");

let adminRouter = express.Router() ;

adminRouter.post("/create-event",upload.single("bannerImage"),createEvent);
adminRouter.get("/all-events",getAllEvents);
adminRouter.get("/single-event",getSingleEvent);
adminRouter.post("/search-event",getSearchEvent);
adminRouter.put("/update-event", updateEvent);
adminRouter.delete("/delete-event", deleteEvent);



// ===== exports code ===== 

module.exports = adminRouter