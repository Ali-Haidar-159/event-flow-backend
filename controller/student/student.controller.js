// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 
let prismaClient = require("../../utils/prisma.utils") ;
let {encryptData} = require("../../utils/encrytion.utils");
const sendEmail = require("../../utils/email.utils");
const processSignupEmail = require("../../helpers/mail/signup.mail");

// all the controllers 

let postSignup = async function(req,res){

    try{
        let {studentId,name,email,password,phone,department,
            hobbies,interests,preferredTags,graduationYear,bio} = req.body ;

        let existEmail = await prismaClient.User.findMany({
            where : {
                email : email
            }
        }) ;

        if (existEmail.length > 0){
            return res.status(400).json({

                success : false,
                message : "Give an unique email address"

            });
        }
        else{

            const encryptionResult = await encryptData(password);

            if (!encryptionResult.success) {
                return res.status(500).json({ error: encryptionResult.error });
            }

            let newUser = await prismaClient.User.create({
                data : {
                    studentId,
                    name,
                    email,
                    password: encryptionResult.data,
                    department,
                    phone
                }
            });

            let newStudentPreference = await prismaClient.StudentPreference.create({
                data : {
                    userId : newUser.id,
                    hobbies,
                    interests,
                    preferredTags,
                    department,
                    graduationYear:graduationYear ? Number.parseInt(graduationYear) : undefined,
                    bio
                }
            }) ;

            let emailBody = processSignupEmail(name,email,studentId,"http://localhost:5173/");
            let isSendEmail = await sendEmail(email,"User Signup Mail",emailBody);

            if (isSendEmail.success){
                    return res.status(201).json({
                    success : true ,
                    message : "new user created successfully",
                    data : {
                        newUser,
                        newStudentPreference
                    }
                })
            }
            else{
                return res.status(201).json({
                    success : true ,
                    message : "new user created successfully but email not send",
                    data : {
                        newUser,
                        newStudentPreference
                    }
                })
            }

        }

    }
    catch(err){

        console.log("find error to signup")
        return res.status(400).json({
            success : false,
            message : "Find error to signup",
            error : err.message

        });

    }
}


let updateProfile = async function(req, res) {
    try {
        const { userId } = req.query; 
        let {
            name,
            phone,
            department,
            hobbies,
            interests,
            preferredTags,
            graduationYear,
            bio
        } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const updatedUser = await prismaClient.User.update({
            where: {
                id: userId
            },
            data: {
                ...(name && { name }),
                ...(phone !== undefined && { phone }),
                ...(department !== undefined && { department })
            }
        });

        const updatedPreference = await prismaClient.StudentPreference.upsert({
            where: {
                userId: userId
            },
            update: {
                ...(hobbies !== undefined && { hobbies }),
                ...(interests !== undefined && { interests }),
                ...(preferredTags !== undefined && { preferredTags }),
                ...(department !== undefined && { department }),
                ...(graduationYear && { graduationYear: Number.parseInt(graduationYear) }),
                ...(bio !== undefined && { bio })
            },
            create: {
                userId: userId,
                hobbies: hobbies || [],
                interests: interests || [],
                preferredTags: preferredTags || [],
                department,
                graduationYear: graduationYear ? Number.parseInt(graduationYear) : undefined,
                bio
            }
        });

        const { password, ...userWithoutPassword } = updatedUser;

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: {
                user: userWithoutPassword,
                preference: updatedPreference
            }
        });

    } catch (err) {
        console.log("Error updating profile: ", err.message);

        if (err.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: "User not found with the provided ID"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Failed to update profile",
            error: err.message
        });
    }
};


let getProfile = async function(req, res) {
    try {
        const { userId, email } = req.query;

        if (!userId && !email) {
            return res.status(400).json({
                success: false,
                message: "User ID or Email is required"
            });
        }

        const user = await prismaClient.User.findFirst({
            where: {
                ...(userId ? { id: userId } : {}),
                ...(email ? { email: email.trim().toLowerCase() } : {})
            },
            include: {
                preference: true,
                club: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { password, ...userWithoutPassword } = user;

        return res.status(200).json({
            success: true,
            data: userWithoutPassword
        });
    } catch (err) {
        console.log("Error fetching profile: ", err.message);
        return res.status(400).json({
            success: false,
            message: "Failed to fetch profile",
            error: err.message
        });
    } finally {
        await prismaClient.$disconnect();
    }
};

let getAllStudents = async function(req, res) {
    try {
        const students = await prismaClient.User.findMany({
            where: {
                role: "STUDENT"
            },
            include: {
                preference: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const sanitized = students.map(({ password, ...rest }) => rest);

        return res.status(200).json({
            success: true,
            data: sanitized
        });
    } catch (err) {
        console.log("Error getting students: ", err.message);
        return res.status(400).json({
            success: false,
            message: "Failed to get students",
            error: err.message
        });
    } finally {
        await prismaClient.$disconnect();
    }
};

let getMyRegistrations = async function(req, res) {
    try {
        const userId = req.user?.id || req.query.userId || req.body.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const registrationDelegate = prismaClient.registration || prismaClient.Registration;

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
    } catch (err) {
        console.error("Error fetching student registrations: ", err.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student registrations",
            error: err.message
        });
    }
};

// ===== exports code ===== 

module.exports = {
    postSignup,
    updateProfile,
    getProfile,
    getAllStudents,
    getMyRegistrations,
};