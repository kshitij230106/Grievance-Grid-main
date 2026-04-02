const BASE_URL = "http://localhost:5000";

// ── Login ─────────────────────────────────────────────────────────────────────
export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");
  return data;
};

// ── Create Grievance (with optional photo) ────────────────────────────────────
export const createGrievance = async (title, description, location, photo) => {
  const token = localStorage.getItem("token");

  // FormData sends text + optional file together
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("location", location);
  if (photo) formData.append("photo", photo); // only if user selected one

  // ⚠️ Do NOT set Content-Type manually
  // Browser sets it automatically with correct boundary for multipart
  const response = await fetch(`${BASE_URL}/api/grievances`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};

// ── Get My Grievances ─────────────────────────────────────────────────────────
export const getMyGrievances = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/api/grievances/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.json();
};