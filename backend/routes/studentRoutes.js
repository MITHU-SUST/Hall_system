const express = require("express");
const router = express.Router();
const db = require("../config/db");


// 🟢 STUDENT REGISTER
router.post("/register", (req, res) => {
    const { reg_no, name, room_no } = req.body;

    // validation (10 digit reg_no)
    if (!reg_no || reg_no.length !== 10) {
        return res.json({ error: "Reg No must be 10 digits" });
    }

    const sql = "INSERT INTO students (reg_no, name, room_no) VALUES (?, ?, ?)";

    db.query(sql, [reg_no, name, room_no], (err, result) => {
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
    const { reg_no } = req.body;

    const sql = "SELECT * FROM students WHERE reg_no=?";

    db.query(sql, [reg_no], (err, result) => {
        if (err) return res.json(err);

        if (result.length === 0) {
            return res.json({ error: "Student not found" });
        }

        res.json(result[0]);
    });
});


module.exports = router;