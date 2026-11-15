// initial code 

"use strict"

// ===== main code =====

// import all the packages 
let passport = require("passport")
let LocalStrategy = require("passport-local").Strategy
let bcrypt = require("bcrypt")

let prisma = require("../utils/prisma.utils");


passport.use(new LocalStrategy({usernameField: "email",passwordField: "password",},async (email, password, done) => {
        try {
            const user = await prisma.User.findUnique({
                where: { 
                    email 
                },
            });

            if (!user) {
            return done(null, false, {
                message: "Invalid email or password",
            });
            }

            const passwordHash = user.password || user.passwordHash;

            if (!passwordHash) {
                return done(null, false, {
                    message: "Invalid email or password",
                });
            }

            const valid = await bcrypt.compare(password, passwordHash);

            if (!valid) {
                return done(null, false, {
                    message: "Invalid email or password",
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const userClient = prisma.User || prisma.user;
        const user = await userClient.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            clubId: true,
            studentId: true,
        },
        });

        done(null, user);
    } 
    catch (error) {
        done(error);
    }
});

module.exports =  passport;