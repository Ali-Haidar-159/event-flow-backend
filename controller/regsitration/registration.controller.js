// ===== initial code =====

"use strict";

// ===== main code =====

// import all the packages 
const crypto = require("crypto");
const prismaClient = require("../../utils/prisma.utils");

const prisma = prismaClient;
if (prisma && !prisma.Registration) {
    prisma.Registration = prisma.registration;
    prisma.Event = prisma.event;
    prisma.Payment = prisma.payment;
    prisma.User = prisma.user;
    prisma.Attendance = prisma.attendance;
}

let postEventRegister = async function (req, res) {
    try {
        const eventId = req.query.eventId || req.body.eventId;
        const userId = req.user?.id || req.body.userId || req.query.userId;

        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "Event ID is required"
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const event = await (prisma.event || prisma.Event).findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Check if already registered
        const existingRegistration = await (prisma.registration || prisma.Registration).findUnique({
            where: {
                userId_eventId: { userId, eventId }
            },
            include: {
                payment: true
            }
        });

        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: "You have already registered or initiated registration for this event.",
                data: existingRegistration
            });
        }

        // Handle free event if registration fee is 0
        const fee = Number(event.registrationFee);
        if (fee === 0) {
            const uniqueTicketId = `TICKET_${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
            const registration = await (prisma.registration || prisma.Registration).create({
                data: {
                    userId,
                    eventId,
                    status: "CONFIRMED",
                    ticketId: uniqueTicketId,
                    payment: {
                        create: {
                            amount: 0,
                            status: "SUCCESS",
                            method: "BKASH",
                            transactionId: `FREE_${Date.now()}`
                        }
                    }
                },
                include: {
                    payment: true,
                    event: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            studentId: true,
                            department: true,
                            role: true
                        }
                    }
                }
            });

            return res.status(200).json({
                success: true,
                message: "Registration confirmed successfully for free event.",
                data: {
                    registrationId: registration.id,
                    ticketId: registration.ticketId,
                    transactionId: registration.payment?.transactionId,
                    amount: 0,
                    registrationStatus: registration.status,
                    paymentStatus: registration.payment?.status,
                    event: registration.event,
                    user: registration.user
                }
            });
        }

        // Paid event: create registration and payment (INITIATED status)
        const registration = await (prisma.registration || prisma.Registration).create({
            data: {
                userId,
                eventId,
                status: "PENDING",
                payment: {
                    create: {
                        amount: event.registrationFee,
                        status: "INITIATED",
                        method: "BKASH"
                    }
                }
            },
            include: {
                payment: true,
                event: true
            }
        });

        return res.status(200).json({
            success: true,
            message: "Registration initiated. Please complete the payment.",
            data: {
                registrationId: registration.id,
                amount: registration.event.registrationFee,
                paymentStatus: registration.payment?.status,
                paymentId: registration.payment?.id
            }
        });

    } catch (err) {
        console.log("Find error to register an event : ", err.message);

        return res.status(400).json({
            success: false,
            message: "Find error to register an event",
            error: err.message
        });
    }
};

const verifyAndCompletePayment = async (req, res) => {
    try {
        const { paymentId, transactionId } = req.body;

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: "Payment ID is required"
            });
        }

        const payment = await (prisma.payment || prisma.Payment).findUnique({
            where: { id: paymentId },
            include: { registration: true }
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment session not found"
            });
        }

        if (payment.status === "SUCCESS" || payment.status === "COMPLETED") {
            return res.status(400).json({
                success: false,
                message: "Payment already completed for this session."
            });
        }

        const uniqueTrxId = transactionId || `TRX_BKASH_${Date.now()}`;
        const uniqueTicketId = `TICKET_${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

        const updatedResult = await prisma.$transaction(async (tx) => {
            const paymentDelegate = tx.payment || tx.Payment;
            const registrationDelegate = tx.registration || tx.Registration;

            const updatedPayment = await paymentDelegate.update({
                where: { id: payment.id },
                data: {
                    status: "SUCCESS",
                    transactionId: uniqueTrxId
                }
            });

            const updatedRegistration = await registrationDelegate.update({
                where: { id: payment.registrationId },
                data: {
                    status: "CONFIRMED",
                    ticketId: uniqueTicketId
                },
                include: {
                    event: true,
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
                    }
                }
            });

            return { updatedPayment, updatedRegistration };
        });

        return res.status(200).json({
            success: true,
            message: "Payment successful! Registration and ticket confirmed.",
            data: {
                ticketId: updatedResult.updatedRegistration.ticketId,
                transactionId: updatedResult.updatedPayment.transactionId,
                event: updatedResult.updatedRegistration.event,
                eventTitle: updatedResult.updatedRegistration.event.title,
                user: updatedResult.updatedRegistration.user,
                registrationStatus: updatedResult.updatedRegistration.status,
                paymentStatus: updatedResult.updatedPayment.status
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getMyRegistrations = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId || req.body.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const registrationDelegate = prisma.registration || prisma.Registration;

        const registrations = await registrationDelegate.findMany({
            where: { userId },
            include: {
                event: {
                    include: {
                        club: true
                    }
                },
                payment: true,
                attendance: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const formatted = registrations.map((reg) => {
            const isAttended = Boolean(
                reg.attendance && (reg.attendance.status === "PRESENT" || reg.attendance.status === "ATTENDED")
            );
            return {
                id: reg.id,
                registrationId: reg.id,
                userId: reg.userId,
                eventId: reg.eventId,
                status: reg.status,
                ticketId: reg.ticketId,
                createdAt: reg.createdAt,
                event: reg.event,
                payment: reg.payment,
                attendance: reg.attendance,
                isAttended,
                attendedAt: reg.attendance?.scannedAt || null,
                attendanceStatus: isAttended ? (reg.attendance.status || "PRESENT") : "NOT_ATTENDED"
            };
        });

        return res.status(200).json({
            success: true,
            count: formatted.length,
            data: formatted
        });
    } catch (error) {
        console.error("Error fetching registrations: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch registrations",
            error: error.message
        });
    }
};

// ===== exports code ===== 

module.exports = {
    postEventRegister,
    verifyAndCompletePayment,
    getMyRegistrations,
};