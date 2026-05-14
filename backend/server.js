const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("../frontend"));


// ROUTES
app.use("/student", studentRoutes);
app.use("/complaint", complaintRoutes);
app.use("/admin", adminRoutes);


// TEST
app.get("/", (req, res) => {
    res.send("🚀 Syed Mujtoba Ali Hall Complaint System Running");
});

app.listen(5000, () => {
    console.log("✅ Server running on http://localhost:5000");
});