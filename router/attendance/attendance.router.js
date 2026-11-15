// ===== initial code =====

"use strict";

// ===== main code =====

const express = require("express");
const {
    markAttendance,
    getEventAttendance,
    verifyTicket
} = require("../../controller/attendance/attendance.controller");

const attendanceRouter = express.Router();

attendanceRouter.post("/mark", markAttendance);
attendanceRouter.get("/mark", markAttendance);
attendanceRouter.get("/event", getEventAttendance);
attendanceRouter.get("/event/:eventId", getEventAttendance);
attendanceRouter.get("/event-attendance", getEventAttendance);
attendanceRouter.get("/verify", verifyTicket);
attendanceRouter.get("/verify/:ticketId", verifyTicket);
attendanceRouter.get("/verify-ticket", verifyTicket);

// ===== exports code =====

module.exports = attendanceRouter;
