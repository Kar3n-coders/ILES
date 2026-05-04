const BACKEND_URL = process.env.REACT_APP_API_BASE_URL;

function getHeaders() {
  const token = localStorage.getItem("iles_auth_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// --- CORE REQUEST WRAPPER ----------
async function request(endpoint, options = {}) {
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    headers: getHeaders(),
    ...options,
  });

  //Token expired - clear storage and redirect to login
  if (response.status === 401) {
    localStorage.removeItem("iles_auth_token");
    localStorage.removeItem("iles_refresh_token");
    window.location.href = "/login";
    return null;
  }

  // Try to parse JSON
  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    // Build a human-readable error message from the DRF error format
    const message =
      data.detail ||
      data.error ||
      Object.entries(data)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join(" | ") ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

// ---- AUTH ENDPOINTS-----
export async function loginUser({ username, password }) {
  const data = await request("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  localStorage.setItem("iles_auth_token", data.access);
  localStorage.setItem("iles_refresh_token", data.refresh);

  return { user: data.user, token: data.access };
}

export async function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}


export async function getProfile() {
  return request("/auth/profile/");
}

export async function getLogbooks() {
  return request("/logbook/");
}

export async function getLogbook(id) {
  return request(`/logbook/${id}/`);
}

export async function createLogbook(data) {
  return request("/logbook/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateLogbook(logId, logData) {
  return request(`/logbook/${logId}/`, {
    method: "PATCH",
    body: JSON.stringify(logData),
  });
}

export function submitLogbook(logId) {
  return request(`/logbook/${logId}/submit/`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

// -----PLACEMENT ENDPOINTS---------
export function getPlacements() {
  return request("/placements/");
}

export function getPlacement(id) {
  return request(`/placements/${id}/`);
}

//-------EVALUTATION ENDPOINTS ----------

export function getEvaluationCriteria() {
  return request("/evaluation/criteria/");
}

export function getEvaluations() {
  return request("/evaluation/");
}

export function createEvaluation(data) {
  return request("/evaluation/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getEvaluationSummary(placementId) {
  return request(`/evaluation/summary/${placementId}/`);
}

// ----REVIEW ENDPOINTS-------
export function getReviews() {
  return request("/reviews/");
}

export function createReview(data) {
  return request("/review/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
