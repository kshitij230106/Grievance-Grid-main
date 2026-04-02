const express = require("express");
const router  = express.Router();
const { getAllGrievances, getStats, updateStatus, deleteGrievance } = require("../controllers/adminController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

router.get("/grievances",      getAllGrievances);
router.get("/stats",           getStats);
router.put("/grievances/:id",  updateStatus);
router.delete("/grievances/:id", deleteGrievance);

module.exports = router;