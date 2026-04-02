const express = require("express");
const cors    = require("cors");
const path    = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
// Frontend can access them via: http://localhost:5000/uploads/filename.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth",       require("./routes/authRoutes"));
app.use("/api/grievances", require("./routes/grievanceRoutes"));
app.use("/api/admin",      require("./routes/adminRoutes"));

app.get("/", (req, res) => res.send("GrievanceGrid backend running"));

app.listen(5000, () => console.log("Server running on port 5000"));