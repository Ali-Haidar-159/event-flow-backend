// ===== initial code =====

"use strict";

// ===== main code =====

const passport = require("../../config/passport.config");
const prismaClient = require("../../utils/prisma.utils");


const postLogin = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("Passport auth error:", err);
            return res.status(500).json({
                success: false,
                message: "Authentication error",
                error: err.message
            });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: info?.message || "Invalid email or password"
            });
        }

        req.logIn(user, async (loginErr) => {
            if (loginErr) {
                console.error("Login session error:", loginErr);
                return res.status(500).json({
                    success: false,
                    message: "Login session failed",
                    error: loginErr.message
                });
            }

            try {
                const userModel = prismaClient.User || prismaClient.user;
                const fullUser = await userModel.findUnique({
                    where: { id: user.id },
                    include: {
                        club: true,
                        preference: true
                    }
                });

                const userObj = fullUser || user;
                const { password, passwordHash, ...userWithoutPassword } = userObj;

                return res.status(200).json({
                    success: true,
                    message: "Logged in successfully",
                    user: userWithoutPassword,
                    data: userWithoutPassword
                });
            } catch (queryErr) {
                console.error("Error retrieving user details after login:", queryErr);
                const { password, passwordHash, ...userWithoutPassword } = user;
                return res.status(200).json({
                    success: true,
                    message: "Logged in successfully",
                    user: userWithoutPassword,
                    data: userWithoutPassword
                });
            }
        });
    })(req, res, next);
};

/**
 * Controller to handle user logout
 */
const postLogout = (req, res) => {
    if (typeof req.logout === "function") {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Logout failed",
                    error: err.message
                });
            }
            if (req.session) {
                req.session.destroy(() => {
                    res.clearCookie("connect.sid");
                    return res.status(200).json({
                        success: true,
                        message: "Logged out successfully"
                    });
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Logged out successfully"
                });
            }
        });
    } else {
        if (req.session) {
            req.session.destroy(() => {
                res.clearCookie("connect.sid");
                return res.status(200).json({
                    success: true,
                    message: "Logged out successfully"
                });
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });
        }
    }
};

/**
 * Controller to get current authenticated user session
 */
const getMe = async (req, res) => {
    try {
        if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const userModel = prismaClient.User || prismaClient.user;
        const user = await userModel.findUnique({
            where: { id: req.user.id },
            include: {
                club: true,
                preference: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const { password, passwordHash, ...userWithoutPassword } = user;

        return res.status(200).json({
            success: true,
            user: userWithoutPassword,
            data: userWithoutPassword
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get user session",
            error: err.message
        });
    }
};

// ===== exports code =====

module.exports = {
    postLogin,
    postLogout,
    getMe
};
