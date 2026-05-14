const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🟢 ADMIN LOGIN
router.post("/login", (req, res) => {
    const { admin_id, password } = req.body;
    const username = admin_id; // for clarity in logs

    console.log("Admin Login Attempt: ", username, password);
    // validation
    if (!username || !password) {
        return res.json({ error: "Username and Password required" });
    }

    // check admin in database
    const sql = "SELECT * FROM admin WHERE username=? AND password=?";

    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.json({ error: err.message });
        }

        if (result.length === 0) {
            return res.json({ error: "Invalid Username or Password" });
        }

        // success response
        res.json({
            message: "Login successful",
            admin: {
                id: result[0].id,
                name: result[0].name,
                username: result[0].username
            }
        });
    });
});

module.exports = router;