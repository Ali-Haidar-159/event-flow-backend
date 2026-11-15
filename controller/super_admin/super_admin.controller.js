// ===== initial code =====

"use strict"

// ===== main code =====

// import all tha packages 
let {v4 : uuidv4} = require("uuid");

let processAdminAppointmentEmail = require("../../helpers/mail/adminAppointment.mail");
let sendEmail = require("../../utils/email.utils") ;
let prismaClient = require("../../utils/prisma.utils");

// controllers 
let createClub = async function(req,res){

    try{

        let {name,description, admin} = req.body ;

        if (!name){
            return res.status(400).json({
                success : false ,
                message : "Club name is required"
            });
        };

        let profileImageURL  = null;
        if (req.file && req.file.path) {
            profileImageURL = req.file.path; 
        }

        if (admin && admin.trim()) {
            let user = await prismaClient.User.findFirst({
                where: {
                    email: admin.trim().toLowerCase()
                }
            });

            if (user) {

                let newClub = await prismaClient.Club.create({
                    data: {
                            id: uuidv4(),
                            name,
                            description: description || null,
                            profileImage: profileImageURL,
                            admin: admin ? admin.trim().toLowerCase() : ""
                        }
                    }) ;

                await prismaClient.User.update({
                    where: {
                        email: admin.trim().toLowerCase()
                    },
                    data: {
                        role: "ADMIN",
                        clubId: newClub.id
                    }
                });


                let emailBody = processAdminAppointmentEmail(user.name, name, "http://localhost:5173/");
                let isSendEmail = await sendEmail(user.email, "Admin Appointment Mail", emailBody);

                if (isSendEmail.success) {
                    return res.status(200).json({
                        success: true,
                        message: "Club created successfully and mail sent.",
                        data: newClub
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        message: "Club created successfully but mail not send.",
                        data: newClub
                    });
                }

            }
            else{
                return res.status(201).json({
                    success: false,
                    message: "Club is not created ! Email is not found in Event Flow"
                });
            }

        }

    }
    catch(err){
        console.log("Find error to create the club : ",err.message)
        return res.status(400).json({
            success : false,
            message : "Find error to create club",
            error : err.message
        });
    }    
    finally{
        await prismaClient.$disconnect()
    }
}



let getAllClubs = async function(req,res){

    try{

        let allClubs = await prismaClient.Club.findMany() ;

        return res.status(200).json({
            success: true,
            data: allClubs
        });

    }
    catch(err){
        console.log("Find error to get clubs : ",err.message)
        return res.status(400).json({
            success : false,
            message : "Find error to get clubs",
            error : err.message
        });
    }
    finally{
        await prismaClient.$disconnect()
    }

}



let getSingleClub = async function(req,res){

    try{

        let club = await prismaClient.Club.findMany({
            where: {
                id : req.query.clubId
            }
        }) ;

        return res.status(200).json({
            success: true,
            data: club
        });

    }
    catch(err){
        console.log("Find error to get the club : ",err.message)
        return res.status(400).json({
            success : false,
            message : "Find error to get club",
            error : err.message
        });
    }
    finally{
        await prismaClient.$disconnect()
    }

}



let getSearchClub = async function (req, res) {
    try {
        const clubName  = req.body.clubName;

        if (!clubName) {
            return res.status(400).json({
                success: false,
                message: "Club search query 'clubName' is required"
            });
        }

        let club = await prismaClient.club.findMany({
            where: {
                name: {
                    contains: clubName,
                    mode: 'insensitive' // Case-insensitive search (PostgreSQL)
                }
            }
        });

        return res.status(200).json({
            success: true,
            data: club
        });

    } catch (err) {
        console.log("Find error to get the club : ", err.message);
        return res.status(400).json({
            success: false,
            message: "Find error to get club",
            error: err.message
        });
    }
};



let updateClub = async function(req, res) {
    try {
        const { clubId } = req.query;
        const { name, description, admin } = req.body;

        if (!clubId) {
            return res.status(400).json({
                success: false,
                message: "Club ID is required"
            });
        }

        const existingClub = await prismaClient.Club.findUnique({
            where: {
                id: clubId
            }
        });

        if (!existingClub) {
            return res.status(404).json({
                success: false,
                message: "Club not found with the provided ID"
            });
        }

        let user = null;
        let normalizedAdmin = undefined;

        if (admin !== undefined && admin !== null && admin.trim() !== "") {
            normalizedAdmin = admin.trim().toLowerCase();

            user = await prismaClient.User.findFirst({
                where: {
                    email: normalizedAdmin
                }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User email not found to set Admin"
                });
            }

            // remove ADMIN role from previous admin(s) of this club
            await prismaClient.User.updateMany({
                where: {
                    clubId: clubId,
                    NOT: {
                        id: user.id
                    }
                },
                data: {
                    role: "STUDENT",
                    clubId: null
                }
            });

            // assign ADMIN role to the new admin
            await prismaClient.User.update({
                where: {
                    id: user.id
                },
                data: {
                    role: "ADMIN",
                    clubId: clubId
                }
            });
        }

        const profileImageURL = req.file && req.file.path ? req.file.path : undefined;

        const updatedClub = await prismaClient.Club.update({
            where: {
                id: clubId
            },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(profileImageURL && { profileImage: profileImageURL }),
                ...(normalizedAdmin !== undefined && { admin: normalizedAdmin })
            }
        });

        if (normalizedAdmin && user) {
            let emailBody = processAdminAppointmentEmail(user.name, updatedClub.name, "http://localhost:5173/");
            let isSendEmail = await sendEmail(normalizedAdmin, "Admin Appointment Mail", emailBody);

            if (isSendEmail.success) {
                return res.status(200).json({
                    success: true,
                    message: "Club updated successfully and mail send successfully",
                    data: updatedClub
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Club updated successfully but mail not send.",
                    data: updatedClub
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Club updated successfully",
            data: updatedClub
        });

    } catch (err) {
        console.log("Find error to update the club : ", err.message);

        if (err.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: "Club not found with the provided ID"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Find error to update club",
            error: err.message
        });
    }
};


let deleteClub = async function(req, res) {
    try {
        const { clubId } = req.query; 

        if (!clubId) {
            return res.status(400).json({
                success: false,
                message: "Club ID is required"
            });
        }

        const deletedClub = await prismaClient.Club.delete({
            where: {
                id: clubId
            }
        });

        return res.status(200).json({
            success: true,
            message: "Club deleted successfully",
            data: deletedClub
        });

    } catch (err) {
        console.log("Find error to delete the club : ", err.message);

        if (err.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: "Club not found with the provided ID"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Find error to delete club",
            error: err.message
        });
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
        console.log("Find error to get students : ", err.message);
        return res.status(400).json({
            success: false,
            message: "Find error to get students",
            error: err.message
        });
    } finally {
        await prismaClient.$disconnect();
    }
};

let getAllAdmins = async function(req, res) {
    try {
        const admins = await prismaClient.User.findMany({
            where: {
                role: "ADMIN"
            },
            include: {
                club: true,
                preference: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        const sanitized = admins.map(({ password, ...rest }) => rest);

        return res.status(200).json({
            success: true,
            data: sanitized
        });
    } catch (err) {
        console.log("Find error to get admins : ", err.message);
        return res.status(400).json({
            success: false,
            message: "Find error to get admins",
            error: err.message
        });
    } finally {
        await prismaClient.$disconnect();
    }
};

// ===== exports code ===== 

module.exports = {
    createClub,
    getAllClubs,
    getSingleClub,
    getSearchClub,
    updateClub,
    deleteClub,
    getAllStudents,
    getAllAdmins,
}