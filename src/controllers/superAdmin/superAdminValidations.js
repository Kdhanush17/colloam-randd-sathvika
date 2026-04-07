const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models/index");
const logger = require("../../../utils/winston");


const DatabaseMapping = require("../../models/databaseMapping");
const roles = require("../../models/roles");

const resetPasswordForAllUsers = async (req, res, next) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        // Validate inputs
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Email, new password, and confirm password are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate password length and strength
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter, one lowercase letter, and one digit",
            });
        }

        // Check if newPassword and confirmPassword match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match" });
        }
        next();
    } catch (error) {
        logger.createLog(__filename, error.message, req);
        return logger.error(res, "Exception in reset password for all users.");
    }
};




const superAdminCreate = async function (req, res, next) {
    try {

        const { username, email, password,} = req.body;

        // Validate presence of required fields

        const requiredFields = ['username', 'email', 'password'];
        for (let field of requiredFields) {
            if (!req.body[field]) {
                return logger.error(res, `${field} parameter is missing or empty`);
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
        }




        next()
    } catch (error) {
        logger.createLog(__filename, error.message, req);
        return logger.error(res, "Exception in super admin create.");
    }

};




const superAdminLogin = async function (req, res, next) {
    try {

        const { email, password } = req.query;

        // Validate presence of required fields

        const requiredFields = ['email', 'password'];
        for (let field of requiredFields) {
            if (!req.query[field]) {
                return logger.error(res, `${field} parameter is missing or empty`);
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
        }
        // Validate password strength
        // if (password.length < 6) {
        //     return logger.error(res, "Password must be at least 6 characters long.");
        // }
        // if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        //     return logger.error(res, "Password must contain at least one uppercase letter, one lowercase letter, and one digit.");
        // }

        next()
    } catch (error) {
        logger.createLog(__filename, error.message, req);
        return logger.error(res, "Exception in super admin login");
    }

};



const superAdminAddAdmin = async (req, res, next) => {
    try {
        const { adminName, adminEmail, adminPassword, adminCompany, adminAddress, role_id } = req.body;

        // Validate presence of required fields
        const requiredFields = ['adminName', 'adminEmail', 'adminPassword', 'adminCompany', 'adminAddress', 'role_id'];
        for (let field of requiredFields) {
            if (!req.body[field]) {
                return logger.error(res, `${field} parameter is missing or empty`);
            }
        }



        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(adminEmail)) {

            return res.status(400).json({ message: "Invalid admin email format" });

        }
        if (adminEmail) {
            if (adminEmail && !emailRegex.test(adminEmail)) {
                return res.status(400).json({ message: "Invalid admin email format" });
            }
        }
        // Check if role_id exists
        let role = await roles.findById(req.body.role_id);
        if (!role) {
            return logger.error(res, 'Role ID not found');
        }
        // Validate password strength
        // if (adminPassword.length < 6) {
        //     return logger.error(res, "Password must be at least 6 characters long.");
        // }
        // if (!/[A-Z]/.test(adminPassword) || !/[a-z]/.test(adminPassword) || !/[0-9]/.test(adminPassword)) {
        //     return logger.error(res, "Password must contain at least one uppercase letter, one lowercase letter, and one digit.");
        // }
        // Validate user_role_id exists in the roles collection

        const userRoleData = await roles.findById(user_role_id);

        if (!userRoleData) {
            return res.status(404).json({ message: "User role ID not found" });
        }
        next()
    } catch (error) {
        logger.createLog(__filename, error.message, req);
        return logger.error(res, "Exception in super admin add admin.");
    }

};


const superAdminUpdate = async (req, res, next) => {
    try {
        const validFields = [
             "email", "role_id", "password", "oldPassword", "newPassword", "confirmPassword", "newEmail", "newUsername"
        ];

        // Check for invalid fields
        const invalidFields = Object.keys(req.body).filter((key) => !validFields.includes(key));
        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: `Invalid parameters: ${invalidFields.join(", ")}`,
            });
        }

        // Check for empty values in valid fields
        const emptyFields = Object.entries(req.body)
            .filter(([key, value]) => validFields.includes(key) && (value === undefined || value === null || value === ""))
            .map(([key]) => key);

        if (emptyFields.length > 0) {
            return res.status(400).json({
                message: `Empty values provided for: ${emptyFields.join(", ")}`,
            });
        }


        next()
    } catch (error) {
        logger.createLog(__filename, error.message, req);
        return logger.error(res, "Exception in super admin update");
    }
};







module.exports = { resetPasswordForAllUsers, superAdminCreate, superAdminLogin, superAdminAddAdmin, superAdminUpdate };
