const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🟢 ADMIN LOGIN
router.post("/login", (req, res) => {
    const { admin_id, password } = req.body;

    console.log("Admin Login Attempt: ", admin_id, password);
    // validation
    if (!admin_id || !password) {
        return res.json({ error: "admin_id and Password required" });
    }

    // check admin in database
    const sql = "SELECT * FROM admin WHERE admin_id=? AND password=?";

    db.query(sql, [admin_id, password], (err, result) => {
        if (err) {
            return res.json({ error: err.message });
        }

        if (result.length === 0) {
            return res.json({ error: "Invalid admin_id or Password" });
        }

        // success response
        res.json({
            message: "Login successful",
            admin: {
                id: result[0].id,
                name: result[0].name,
                admin_id: result[0].admin_id
            }
        });
    });
});

module.exports = router;