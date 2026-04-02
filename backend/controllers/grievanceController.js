const { grievancesStore } = require("../store/grievancesStore");

// POST /api/grievances
exports.createGrievance = (req, res) => {
  const { title, description, location } = req.body;

  if (!title || !description)
    return res.status(400).json({ message: "Title and description are required" });

  const grievance = {
    id:          Date.now().toString(),
    userId:      req.user.id,
    title,
    description,
    location:    location || "",
    image:       req.file ? req.file.filename : null, // null if no photo
    status:      "Pending",
    createdAt:   new Date().toISOString(),
  };

  grievancesStore.push(grievance);
  res.status(201).json({ message: "Grievance submitted successfully", grievance });
};

// GET /api/grievances/my
exports.getMyGrievances = (req, res) => {
  const mine = grievancesStore.filter(g => g.userId === req.user.id);
  res.json(mine);
};