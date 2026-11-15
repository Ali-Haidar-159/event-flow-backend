// ===== initial code =====

"use strict";

// ===== main code =====

const prismaClient = require("../../utils/prisma.utils");

const prisma = prismaClient;
if (prisma && !prisma.Attendance) {
    prisma.Attendance = prisma.attendance;
    prisma.Registration = prisma.registration;
    prisma.Event = prisma.event;
    prisma.User = prisma.user;
    prisma.Payment = prisma.payment;
}

const markAttendance = async (req, res) => {
    try {
        let ticketId = req.body?.ticketId || req.query?.ticketId || req.params?.ticketId;
        const eventId = req.body?.eventId || req.query?.eventId || req.params?.eventId;

        if (!ticketId) {
            return res.status(400).json({
                success: false,
                message: "Ticket ID is required"
            });
        }

        // Defensive parsing: If ticketId is a URL or JSON string, extract raw ticketId
        if (typeof ticketId === "string") {
            ticketId = ticketId.trim();
            if (ticketId.includes("ticketId=")) {
                try {
                    const match = ticketId.match(/[?&]ticketId=([^&]+)/);
                    if (match) ticketId = decodeURIComponent(match[1]);
                } catch {
                    // keep raw
                }
            } else if (ticketId.startsWith("{")) {
                try {
                    const parsed = JSON.parse(ticketId);
                    if (parsed.ticketId) ticketId = parsed.ticketId;
                } catch {
                    // keep raw
                }
            }
        }

        const registrationDelegate = prisma.registration || prisma.Registration;
        const attendanceDelegate = prisma.attendance || prisma.Attendance;

        // Find registration by ticketId or registration id
        const registration = await registrationDelegate.findFirst({
            where: {
                OR: [
                    { ticketId: ticketId },
                    { id: ticketId }
                ]
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        studentId: true,
                        department: true,
                        phone: true,
                        role: true
                    }
                },
                event: {
                    include: {
                        club: true
                    }
                }
            }
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Invalid ticket ID: Registration not found"
            });
        }

        // Verify event matches if eventId is provided
        if (eventId && registration.eventId !== eventId) {
            return res.status(400).json({
                success: false,
                message: "Ticket does not belong to this event"
            });
        }

        const targetEventId = registration.eventId;
        const targetUserId = registration.userId;

        // Check if attendance already exists
        const existingAttendance = await attendanceDelegate.findFirst({
            where: {
                OR: [
                    { ticketId: registration.ticketId },
                    { eventId: targetEventId, userId: targetUserId }
                ]
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        studentId: true,
                        department: true,
                        phone: true,
                        role: true
                    }
                },
                event: true
            }
        });

        const attendeeUser = registration.user || existingAttendance?.user;
        const eventData = registration.event || existingAttendance?.event;
        const scannedDate = existingAttendance?.scannedAt || new Date();

        if (existingAttendance) {
            return res.status(200).json({
                success: true,
                message: "Already marked attended",
                alreadyMarked: true,
                data: {
                    ticketId: registration.ticketId,
                    registrationId: registration.id,
                    eventId: targetEventId,
                    eventTitle: eventData?.title || "University Event",
                    clubName: eventData?.club?.name || "University Club",
                    venue: eventData?.venue || "Campus Venue",
                    studentName: attendeeUser?.name || "Registered Student",
                    studentId: attendeeUser?.studentId || "N/A",
                    email: attendeeUser?.email || "",
                    department: attendeeUser?.department || "General",
                    phone: attendeeUser?.phone || "N/A",
                    status: existingAttendance.status || "PRESENT",
                    markedAt: scannedDate instanceof Date ? scannedDate.toISOString() : new Date(scannedDate).toISOString(),
                    scannedAt: scannedDate,
                    attendee: attendeeUser,
                    event: eventData,
                    attendance: existingAttendance
                }
            });
        }

        // Create new attendance record
        const attendance = await attendanceDelegate.create({
            data: {
                eventId: targetEventId,
                userId: targetUserId,
                ticketId: registration.ticketId,
                registrationId: registration.id,
                status: "PRESENT",
                scannedAt: new Date()
            }
        });

        const newScannedDate = attendance.scannedAt || new Date();

        return res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            alreadyMarked: false,
            data: {
                ticketId: registration.ticketId,
                registrationId: registration.id,
                eventId: targetEventId,
                eventTitle: eventData?.title || "University Event",
                clubName: eventData?.club?.name || "University Club",
                venue: eventData?.venue || "Campus Venue",
                studentName: attendeeUser?.name || "Registered Student",
                studentId: attendeeUser?.studentId || "N/A",
                email: attendeeUser?.email || "",
                department: attendeeUser?.department || "General",
                phone: attendeeUser?.phone || "N/A",
                status: "PRESENT",
                markedAt: newScannedDate instanceof Date ? newScannedDate.toISOString() : new Date(newScannedDate).toISOString(),
                scannedAt: newScannedDate,
                attendee: attendeeUser,
                event: eventData,
                attendance
            }
        });

    } catch (error) {
        console.error("Error marking attendance:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error marking attendance",
            error: error.message
        });
    }
};

const getEventAttendance = async (req, res) => {
    try {
        const eventId = req.query?.eventId || req.params?.eventId || req.body?.eventId;

        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "Event ID is required"
            });
        }

        const attendanceDelegate = prisma.attendance || prisma.Attendance;

        const attendances = await attendanceDelegate.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        studentId: true,
                        department: true,
                        phone: true,
                        role: true
                    }
                },
                registration: {
                    include: {
                        payment: true
                    }
                }
            },
            orderBy: {
                scannedAt: "desc"
            }
        });

        return res.status(200).json({
            success: true,
            count: attendances.length,
            data: attendances
        });

    } catch (error) {
        console.error("Error fetching event attendance:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching event attendance",
            error: error.message
        });
    }
};

const verifyTicket = async (req, res) => {
    try {
        const ticketId = req.query?.ticketId || req.params?.ticketId || req.body?.ticketId;

        if (!ticketId) {
            return res.status(400).json({
                success: false,
                message: "Ticket ID is required"
            });
        }

        const registrationDelegate = prisma.registration || prisma.Registration;
        const attendanceDelegate = prisma.attendance || prisma.Attendance;

        const registration = await registrationDelegate.findUnique({
            where: { ticketId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        studentId: true,
                        department: true,
                        phone: true,
                        role: true
                    }
                },
                event: true,
                payment: true,
                attendance: true
            }
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                valid: false,
                message: "Invalid ticket ID"
            });
        }

        // Also check attendance table if not linked through relation
        const attendanceRecord = registration.attendance || await attendanceDelegate.findUnique({
            where: { ticketId }
        });

        const isAttended = Boolean(attendanceRecord);

        return res.status(200).json({
            success: true,
            valid: true,
            message: "Ticket verified successfully",
            data: {
                ticketId: registration.ticketId,
                registrationId: registration.id,
                registrationStatus: registration.status,
                isAttended,
                attendance: attendanceRecord,
                attendee: registration.user,
                event: registration.event,
                payment: registration.payment
            }
        });

    } catch (error) {
        console.error("Error verifying ticket:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error verifying ticket",
            error: error.message
        });
    }
};

// ===== exports code =====

module.exports = {
    markAttendance,
    getEventAttendance,
    verifyTicket
};
