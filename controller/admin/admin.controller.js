// ===== initial code =====

"use strict"

// ===== main code =====

// import all the packages 
let prismaClient = require("../../utils/prisma.utils");


let createEvent = async function(req,res){

    try{

        let {title,description,date,time,venue,registrationFee,registrationDeadline,capacity,
            clubId, category, tags} = req.body ;

            let bannerImage = null;
            if (req.file && req.file.path) {
                bannerImage = req.file.path; 
            }

        let normalizedTags = [];
        if (Array.isArray(tags)) {
            normalizedTags = tags;
        } else if (typeof tags === 'string') {
            try {
                const parsed = JSON.parse(tags);
                normalizedTags = Array.isArray(parsed) ? parsed : [tags];
            } catch {
                normalizedTags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
            }
        }

        let newEvent = await prismaClient.event.create({
            data: {
                title,
                description: description || null,
                category: category || null,
                tags: normalizedTags,
                date: new Date(date),
                time,
                venue,
                registrationFee: Number.parseFloat(registrationFee),
                bannerImage,
                registrationDeadline: new Date(registrationDeadline), 
                capacity: Number.parseInt(capacity, 10), 
                status:  "DRAFT",
                clubId
            }
        });

        return res.status(201).json({
            success: true,
            message : "New event created successfully",
            data: newEvent
        });

    }
    catch(err){
        console.log("Find error to create the event : ",err.message)
        return res.status(400).json({
            success : false,
            message : "Find error to create event",
            error : err.message
        });
    }
    finally{
        await prismaClient.$disconnect()
    }

}



let getAllEvents = async function(req,res){

    try{

        let allEvents = await prismaClient.Event.findMany() ;

        return res.status(200).json({
            success: true,
            data: allEvents
        });

    }
    catch(err){
        console.log("Find error to get the events : ",err.message)
        return res.status(400).json({
            success : false,
            message : "Find error to get events",
            error : err.message
        });
    }
    finally{
        await prismaClient.$disconnect()
    }

}


let getSingleEvent = async function(req,res){

    try{

        let event = await prismaClient.Event.findMany({
            where : {
                id : req.query.eventId
            }
        }) ;

        return res.status(200).json({
            success: true,
            data: event
        });

    }
    catch(err){
        console.log("Find error to get the event : ",err.message)
        return res.status(400).json({
            success : false,
            message : "Find error to get event",
            error : err.message
        });
    }
    finally{
        await prismaClient.$disconnect()
    }

}



let getSearchEvent = async function(req,res){

    try{

        let event = await prismaClient.Event.findMany({
            where : {
                title : req.body.eventName
            }
        }) ;

        return res.status(200).json({
            success: true,
            data: event
        });

    }
    catch(err){
        console.log("Find error to get the event : ",err.message)
        return res.status(400).json({
            success : false,
            message : "Find error to get event",
            error : err.message
        });
    }
    finally{
        await prismaClient.$disconnect()
    }

}


let updateEvent = async function(req, res) {
    try {
        const { eventId } = req.query; 
        const { 
            title, 
            description, 
            date, 
            time, 
            venue, 
            registrationFee, 
            registrationDeadline, 
            capacity, 
            status, 
            clubId,
            category,
            tags
        } = req.body;

        // Validation
        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "Event ID is required"
            });
        }

        let normalizedTags = undefined;
        if (tags !== undefined) {
            if (Array.isArray(tags)) {
                normalizedTags = tags;
            } else if (typeof tags === 'string') {
                try {
                    const parsed = JSON.parse(tags);
                    normalizedTags = Array.isArray(parsed) ? parsed : [tags];
                } catch {
                    normalizedTags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                }
            }
        }

        // Prisma Update Query
        const updatedEvent = await prismaClient.Event.update({
            where: {
                id: eventId
            },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(category !== undefined && { category }),
                ...(normalizedTags !== undefined && { tags: normalizedTags }),
                ...(date && { date: new Date(date) }),
                ...(time && { time }),
                ...(venue && { venue }),
                ...(registrationFee !== undefined && { registrationFee }),
                ...(registrationDeadline && { registrationDeadline: new Date(registrationDeadline) }),
                ...(capacity !== undefined && { capacity: parseInt(capacity) }),
                ...(status && { status }),
                ...(clubId && { clubId })
            }
        });

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: updatedEvent
        });

    } catch (err) {
        console.log("Error updating event : ", err.message);

        if (err.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: "Event not found with the provided ID"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Failed to update event",
            error: err.message
        });
    }
};

let deleteEvent = async function(req, res) {
    try {
        const { eventId } = req.query;

        // Validation
        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "Event ID is required"
            });
        }

        // Prisma Delete Query
        const deletedEvent = await prismaClient.Event.delete({
            where: {
                id: eventId
            }
        });

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully",
            data: deletedEvent
        });

    } catch (err) {
        console.log("Error deleting event : ", err.message);

        if (err.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: "Event not found with the provided ID"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Failed to delete event",
            error: err.message
        });
    }
};


// ===== exports code ===== 

module.exports = {
    createEvent,
    getAllEvents,
    getSingleEvent,
    getSearchEvent,
    updateEvent,
    deleteEvent,
}