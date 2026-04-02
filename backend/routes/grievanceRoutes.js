const express  = require("express");
const router   = express.Router();
const { createGrievance, getMyGrievances } = require("../controllers/grievanceController");
const { authMiddleware } = require("../middleware/authMiddleware");
const upload   = require("../config/multerConfig");

// POST /api/grievances — multer handles optional photo
router.post("/", authMiddleware, upload.single("photo"), createGrievance);

// GET /api/grievances/my
router.get("/my", authMiddleware, getMyGrievances);

module.exports = router;