const express = require("express");
const router = express.Router();
const db = require("../config/db");


// 🟢 CREATE COMPLAINT
router.post("/add", (req, res) => {
    const { student_id, category_id, title, description, priority } = req.body;

    const sql = "INSERT INTO complaints (student_id, category_id, title, description, priority, status) VALUES (?, ?, ?, ?, ?, 'pending')";

    db.query(sql, [student_id, category_id, title, description, priority || 'normal'], (err, result) => {
        if (err) {
            console.log(err);
            return res.json({ error: err.message });
        }

        console.log("Complaint Added:", result);
        res.json({ message: "Complaint submitted successfully", id: result.insertId });
    });
});


// 🟢 GET ALL COMPLAINTS (ADMIN)
router.get("/all", (req, res) => {
    const sql = `
        SELECT c.*, s.name, s.reg_no, s.room_no, cat.name as category_name
        FROM complaints c
        JOIN students s ON c.student_id = s.id
        JOIN categories cat ON c.category_id = cat.id
        ORDER BY c.created_at DESC
    `;
    
    db.query(sql, (err, result) => {
        if (err) return res.json({ error: err.message });

        res.json(result);
    });
});


// 🟢 GET STUDENT COMPLAINT HISTORY
router.get("/student/:id", (req, res) => {
    const sql = `
        SELECT c.*, cat.name as category_name
        FROM complaints c
        JOIN categories cat ON c.category_id = cat.id
        WHERE c.student_id=?
        ORDER BY c.created_at DESC
    `;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.json({ error: err.message });

        res.json(result);
    });
});


// 🟢 GET COMPLAINT DETAILS WITH MESSAGES
router.get("/details/:id", (req, res) => {
    const complaintId = req.params.id;
    
    const sql = `
        SELECT c.*, s.name, s.reg_no, s.room_no, cat.name as category_name
        FROM complaints c
        JOIN students s ON c.student_id = s.id
        JOIN categories cat ON c.category_id = cat.id
        WHERE c.id = ?
    `;
    
    db.query(sql, [complaintId], (err, complaint) => {
        if (err) return res.json({ error: err.message });
        
        if (complaint.length === 0) {
            return res.json({ error: "Complaint not found" });
        }
        
        // Get messages for this complaint
        const msgSql = `
            SELECT m.*, a.name as admin_name
            FROM messages m
            LEFT JOIN admin a ON m.admin_id = a.id
            WHERE m.complaint_id = ?
            ORDER BY m.created_at ASC
        `;
        
        db.query(msgSql, [complaintId], (err, messages) => {
            if (err) return res.json({ error: err.message });
            
            res.json({
                complaint: complaint[0],
                messages: messages
            });
        });
    });
});


// 🟢 UPDATE COMPLAINT STATUS
router.put("/status/:id", (req, res) => {
    const { status } = req.body;

    const sql = "UPDATE complaints SET status=?, updated_at=NOW() WHERE id=?";

    db.query(sql, [status, req.params.id], (err, result) => {
        if (err) return res.json({ error: err.message });

        res.json({ message: "Status updated successfully" });
    });
});


// 🟢 ADD MESSAGE TO COMPLAINT
router.post("/message/:id", (req, res) => {
    const { admin_id, message } = req.body;
    const complaint_id = req.params.id;

    const sql = "INSERT INTO messages (complaint_id, admin_id, message) VALUES (?, ?, ?)";

    db.query(sql, [complaint_id, admin_id, message], (err, result) => {
        if (err) return res.json({ error: err.message });

        res.json({ message: "Message added successfully" });
    });
});


// 🟢 GET CATEGORIES
router.get("/categories/list/all", (req, res) => {
    const sql = "SELECT * FROM categories ORDER BY name ASC";

    db.query(sql, (err, result) => {
        if (err) return res.json({ error: err.message });

        res.json(result);
    });
});


module.exports = router;