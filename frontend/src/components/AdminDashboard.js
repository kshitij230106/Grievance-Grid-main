import React, { useEffect, useState, useCallback } from "react";
import "./AdminDashboard.css";

const API      = "http://localhost:5000/api/admin";
const BASE_URL = "http://localhost:5000";

const STATUS_FLOW = {
  Pending: "In Progress",
  "In Progress": "Resolved",
  Resolved: null,
};

const STATUS_COLOR = {
  Pending: "status-pending",
  "In Progress": "status-progress",
  Resolved: "status-resolved",
};

export default function AdminDashboard() {
  const [grievances,         setGrievances]         = useState([]);
  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [stats,              setStats]              = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [filter,             setFilter]             = useState("All");
  const [loading,            setLoading]            = useState(true);
  const [toast,              setToast]              = useState(null);
  const [searchQuery,        setSearchQuery]        = useState("");
  const [sortOrder,          setSortOrder]          = useState("newest");
  const [modalImage,         setModalImage]         = useState(null); // ← NEW

  const token   = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    try {
      const [gRes, sRes] = await Promise.all([
        fetch(`${API}/grievances`, { headers }),
        fetch(`${API}/stats`,      { headers }),
      ]);
      const gData = await gRes.json();
      const sData = await sRes.json();
      if (gData.success) {
        setGrievances(gData.grievances);
        setFilteredGrievances(gData.grievances);
      }
      if (sData.success) setStats(sData.stats);
    } catch {
      showToast("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setModalImage(null); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const today = grievances.filter(
    (g) => new Date(g.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const applySort = (list, order) =>
    [...list].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === "newest" ? dateB - dateA : dateA - dateB;
    });

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(e.target.value);
    const searched = grievances.filter(
      (g) =>
        g.title?.toLowerCase().includes(query) ||
        g.description?.toLowerCase().includes(query) ||
        g.location?.toLowerCase().includes(query) ||
        g.status?.toLowerCase().includes(query)
    );
    setFilteredGrievances(applySort(searched, sortOrder));
  };

  const handleSort = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    setFilteredGrievances(applySort(filteredGrievances, order));
  };

  const filtered =
    filter === "All"
      ? filteredGrievances
      : filteredGrievances.filter((g) => g.status === filter);

  const updateStatus = async (id, newStatus) => {
    try {
      const res  = await fetch(`${API}/grievances/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) { fetchAll(); showToast(`Status updated to "${newStatus}"`); }
    } catch { showToast("Update failed", "error"); }
  };

  const deleteGrievance = async (id) => {
    if (!window.confirm("Delete this complaint permanently?")) return;
    try {
      const res  = await fetch(`${API}/grievances/${id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (data.success) { fetchAll(); showToast("Complaint deleted"); }
    } catch { showToast("Delete failed", "error"); }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="admin-root">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      {/* ── Photo Modal ── */}
      {modalImage && (
        <div className="photo-modal-overlay" onClick={() => setModalImage(null)}>
          <div className="photo-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="photo-modal-close" onClick={() => setModalImage(null)}>✕</button>
            <img src={modalImage} alt="Full size" className="photo-modal-img" />
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">GrievanceGrid</span>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${filter === "All"         ? "active" : ""}`} onClick={() => setFilter("All")}><span>📋</span> All Complaints</button>
          <button className={`nav-item ${filter === "Pending"     ? "active" : ""}`} onClick={() => setFilter("Pending")}><span>🕐</span> Pending</button>
          <button className={`nav-item ${filter === "In Progress" ? "active" : ""}`} onClick={() => setFilter("In Progress")}><span>🔄</span> In Progress</button>
          <button className={`nav-item ${filter === "Resolved"    ? "active" : ""}`} onClick={() => setFilter("Resolved")}><span>✅</span> Resolved</button>
        </nav>
        <button className="logout-btn" onClick={logout}>↩ Logout</button>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-sub">Monitor and manage all citizen grievances</p>
          </div>
          <div className="header-badge">Admin</div>
        </header>

        {/* Stats */}
        <section className="stats-grid">
          <StatCard label="Total"       value={stats.total}      icon="📂" accent="#6366f1" />
          <StatCard label="Pending"     value={stats.pending}    icon="🕐" accent="#f59e0b" />
          <StatCard label="In Progress" value={stats.inProgress} icon="🔄" accent="#3b82f6" />
          <StatCard label="Resolved"    value={stats.resolved}   icon="✅" accent="#10b981" />
          <StatCard label="Today"       value={today}            icon="📅" accent="#ec4899" />
        </section>

        {/* Search + Sort */}
        <div className="search-sort-row">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by title, description, location or status…"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => {
                setSearchQuery("");
                setFilteredGrievances(applySort(grievances, sortOrder));
              }}>✕</button>
            )}
          </div>
          <div className="sort-wrapper">
            <label className="sort-label">Sort by</label>
            <select className="sort-select" value={sortOrder} onChange={handleSort}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Result count */}
        {!loading && (
          <p className="result-count">
            Showing <strong>{filtered.length}</strong> of <strong>{grievances.length}</strong> grievances
            {searchQuery && <span className="result-query"> for "{searchQuery}"</span>}
          </p>
        )}

        {/* Filter tabs */}
        <div className="filter-row">
          {["All", "Pending", "In Progress", "Resolved"].map((f) => (
            <button key={f} className={`filter-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f}
              <span className="filter-count">
                {f === "All" ? stats.total : f === "Pending" ? stats.pending : f === "In Progress" ? stats.inProgress : stats.resolved}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading-state">Loading complaints…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><p>🗂️ No complaints found.</p></div>
        ) : (
          <div className="table-wrapper">
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Photo</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, i) => (
                  <tr key={g.id} className="table-row">
                    <td className="row-num">{i + 1}</td>

                    {/* ── Photo cell — click to open modal ── */}
                    <td className="col-photo">
                      {g.image ? (
                        <div className="thumb-wrapper" onClick={() => setModalImage(`${BASE_URL}/uploads/${g.image}`)}>
                          <img
                            src={`${BASE_URL}/uploads/${g.image}`}
                            alt="grievance"
                            className="admin-thumb"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                          <div className="thumb-overlay">🔍</div>
                        </div>
                      ) : (
                        <span className="admin-no-image">No Image</span>
                      )}
                    </td>

                    <td className="col-title">{g.title}</td>
                    <td className="col-desc" title={g.description}>
                      {g.description.length > 60 ? g.description.slice(0, 60) + "…" : g.description}
                    </td>
                    <td>{g.location || "—"}</td>
                    <td>
                      <span className={`status-pill ${STATUS_COLOR[g.status]}`}>{g.status}</span>
                    </td>
                    <td className="col-date">
                      {new Date(g.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="col-actions">
                      {STATUS_FLOW[g.status] && (
                        <button className="btn btn-advance" onClick={() => updateStatus(g.id, STATUS_FLOW[g.status])}>
                          → {STATUS_FLOW[g.status]}
                        </button>
                      )}
                      <button className="btn btn-delete" onClick={() => deleteGrievance(g.id)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div className="stat-card" style={{ "--accent": accent }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}