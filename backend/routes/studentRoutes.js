const express = require("express");
const router = express.Router();
const db = require("../config/db");
const crypto = require("crypto");

// Helper: Hash password
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// 🟢 STUDENT REGISTER
router.post("/register", (req, res) => {
    const { reg_no, name, room_no, password } = req.body;

    // validation (10 digit reg_no)
    if (!reg_no || reg_no.length !== 10) {
        return res.json({ error: "Reg No must be 10 digits" });
    }

    if (!password || password.length < 4) {
        return res.json({ error: "Password must be at least 4 characters" });
    }

    const hashedPassword = hashPassword(password);
    const sql = "INSERT INTO students (reg_no, name, room_no, password) VALUES (?, ?, ?, ?)";

    console.log("Registering student:", { reg_no, name, room_no, password: hashedPassword });

    db.query(sql, [reg_no, name, room_no, hashedPassword], (err, result) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }

        console.log("Student Registered:", result);
        res.json({ message: "Student Registered Successfully" });
    });
});


// 🟢 STUDENT LOGIN
router.post("/login", (req, res) => {
    const { reg_no, password } = req.body;

    if (!password) {
        return res.json({ error: "Password is required" });
    }

    const sql = "SELECT * FROM students WHERE reg_no=?";

    db.query(sql, [reg_no], (err, result) => {
        if (err) return res.json(err);

        if (result.length === 0) {
            return res.json({ error: "Student not found" });
        }

        const hashedPassword = hashPassword(password);
        if (result[0].password !== hashedPassword) {
            return res.json({ error: "Incorrect password" });
        }

        res.json(result[0]);
    });
});

// 🟢 FORGOT PASSWORD - Generate Reset Token
router.post("/forgot-password", (req, res) => {
    const { reg_no } = req.body;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    const sql = "UPDATE students SET reset_token = ?, reset_token_expires = ? WHERE reg_no = ?";

    db.query(sql, [resetToken, resetExpires, reg_no], (err, result) => {
        if (err) return res.json(err);

        if (result.affectedRows === 0) {
            return res.json({ error: "Student not found" });
        }

        res.json({ 
            message: "Reset token generated. Use this token to reset your password.",
            token: resetToken 
        });
    });
});

// 🟢 RESET PASSWORD
router.post("/reset-password", (req, res) => {
    const { reg_no, token, newPassword } = req.body;

    if (!newPassword || newPassword.length < 4) {
        return res.json({ error: "Password must be at least 4 characters" });
    }

    const sql = "SELECT * FROM students WHERE reg_no = ? AND reset_token = ?";

    db.query(sql, [reg_no, token], (err, result) => {
        if (err) return res.json(err);

        if (result.length === 0) {
            return res.json({ error: "Invalid or expired token" });
        }

        // Check if token has expired
        if (new Date() > new Date(result[0].reset_token_expires)) {
            return res.json({ error: "Token has expired. Please request a new one." });
        }

        const hashedPassword = hashPassword(newPassword);
        const updateSql = "UPDATE students SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE reg_no = ?";

        db.query(updateSql, [hashedPassword, reg_no], (err, updateResult) => {
            if (err) return res.json(err);

            res.json({ message: "Password reset successfully! Please login with your new password." });
        });
    });
});

// 🟢 CHANGE PASSWORD (While logged in)
router.post("/change-password", (req, res) => {
    const { id, currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.json({ error: "Both passwords are required" });
    }

    if (newPassword.length < 4) {
        return res.json({ error: "Password must be at least 4 characters" });
    }

    const sql = "SELECT * FROM students WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) return res.json(err);

        if (result.length === 0) {
            return res.json({ error: "Student not found" });
        }

        const hashedCurrentPassword = hashPassword(currentPassword);
        if (result[0].password !== hashedCurrentPassword) {
            return res.json({ error: "Current password is incorrect" });
        }

        const hashedNewPassword = hashPassword(newPassword);
        const updateSql = "UPDATE students SET password = ? WHERE id = ?";

        db.query(updateSql, [hashedNewPassword, id], (err, updateResult) => {
            if (err) return res.json(err);

            res.json({ message: "Password changed successfully! You will be logged out." });
        });
    });
});

module.exports = router;