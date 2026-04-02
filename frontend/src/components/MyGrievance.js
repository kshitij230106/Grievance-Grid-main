import React, { useEffect, useState } from "react";
import { getMyGrievances } from "../services/api";

function getStatusBadgeClass(status) {
  const s = (status || "Pending").toLowerCase();
  if (s.includes("resolved")) return "badge badge-resolved";
  if (s.includes("progress") || s.includes("in progress")) return "badge badge-open";
  if (s.includes("rejected")) return "badge badge-rejected";
  return "badge badge-pending";
}

function MyGrievance() {
  const [grievances, setGrievances] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const grievancesPerPage = 6;

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const data = await getMyGrievances();

        if (Array.isArray(data)) {
          setGrievances(data);
        } else {
          setGrievances([]);
        }
      } catch (error) {
        console.error("Error fetching grievances:", error);
        setGrievances([]);
      }
    };

    fetchGrievances();
  }, []);

  const deleteGrievance = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this grievance?"
    );

    if (!confirmDelete) return;

    const updated = grievances.filter((_, i) => i !== index);
    setGrievances(updated);
  };

  const filteredGrievances = grievances.filter((g) =>
    (g.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * grievancesPerPage;
  const indexOfFirst = indexOfLast - grievancesPerPage;
  const currentGrievances = filteredGrievances.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredGrievances.length / grievancesPerPage);

  return (
    <div>
      <div className="dashboard-header">
        <div className="dashboard-header-text">
          <h1>My Grievances</h1>
          <p className="text-muted">{filteredGrievances.length} total</p>
        </div>
        <div className="dashboard-header-actions">
          <input
            type="text"
            placeholder="Search grievances..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
            aria-label="Search grievances"
          />
        </div>
      </div>

      {currentGrievances.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden>📋</span>
          <h3>No grievances yet</h3>
          <p>You haven't submitted any grievances. Create one from the Create Grievance page.</p>
        </div>
      ) : (
        <>
          <div className="grievance-list">
            {currentGrievances.map((g) => {
              const realIndex = grievances.indexOf(g);
              return (
                <article key={realIndex} className="grievance-card">
                  <div className="grievance-card-icon" aria-hidden>📌</div>
                  <div className="grievance-card-body">
                    <h3 className="grievance-card-title">{g.title || "No Title"}</h3>
                    <p className="grievance-card-desc">{g.description || "No Description"}</p>
                    <div className="grievance-card-meta">
                      {g.location && (
                        <span className="grievance-card-location" title={g.location}>
                          📍 {g.location.length > 40 ? g.location.slice(0, 40) + "…" : g.location}
                        </span>
                      )}
                      <span className={getStatusBadgeClass(g.status)}>
                        {g.status || "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="grievance-card-actions">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteGrievance(realIndex)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`btn btn-sm ${currentPage === i + 1 ? "active" : "btn-ghost"}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyGrievance;
