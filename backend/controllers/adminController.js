const { grievancesStore } = require("../store/grievancesStore");

const STATUS_ORDER = ["Pending", "In Progress", "Resolved"];

// GET /api/admin/grievances
exports.getAllGrievances = (req, res) => {
  res.json({ success: true, grievances: grievancesStore });
};

// GET /api/admin/stats
exports.getStats = (req, res) => {
  const total      = grievancesStore.length;
  const pending    = grievancesStore.filter(g => g.status === "Pending").length;
  const inProgress = grievancesStore.filter(g => g.status === "In Progress").length;
  const resolved   = grievancesStore.filter(g => g.status === "Resolved").length;

  res.json({ success: true, stats: { total, pending, inProgress, resolved } });
};

// PUT /api/admin/grievances/:id
exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!STATUS_ORDER.includes(status))
    return res.status(400).json({ success: false, message: "Invalid status" });

  const index = grievancesStore.findIndex(g => g.id === id);
  if (index === -1)
    return res.status(404).json({ success: false, message: "Grievance not found" });

  grievancesStore[index].status = status;
  res.json({ success: true, grievance: grievancesStore[index] });
};

// DELETE /api/admin/grievances/:id
exports.deleteGrievance = (req, res) => {
  const { id } = req.params;
  const index = grievancesStore.findIndex(g => g.id === id);

  if (index === -1)
    return res.status(404).json({ success: false, message: "Grievance not found" });

  grievancesStore.splice(index, 1);
  res.json({ success: true, message: "Grievance deleted" });
};