const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function getAuthToken() {
  return localStorage.getItem("iles_auth_token");
}

async function apiFetch(path, options = {}) {
  const token = getAuthToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${path}`, config);

  if (!response.ok) {
    let errorMessage;

    try {
      const errorBody = await response.json();
      if (errorBody.detail) {
        errorMessage = errorBody.detail;
      } else {
        errorMessage = Object.values(errorBody).flat().join(" ");
      }
    } catch {
      errorMessage = `Request failed: ${response.status} ${response.statusText}`;
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function loginUser({ username, password }) {
  return apiFetch("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function logoutUser() {
  return apiFetch("/auth/logout/", { method: "POST" });
}

export async function getUserProfile() {
  return apiFetch("/auth/profile/");
}

export async function getLogs() {
  return apiFetch("/logbook/");
}

export async function getLogById(logId) {
  return apiFetch(`/logbook/${logId}/`);
}

export async function createLog(logData) {
  return apiFetch("/logbook/", {
    method: "POST",
    body: JSON.stringify(logData),
  });
}

export async function updateLog(logId, logData) {
  return apiFetch(`/logbook/${logId}/`, {
    method: "PATCH",
    body: JSON.stringify(logData),
  });
}

export async function submitLog(logId) {
  return apiFetch(`/logbook/${logId}/submit/`, {
    method: "POST",
  });
}

export async function getEvaluationCriteria() {
  return apiFetch("/evaluation/criteria/");
}

export async function submitEvaluation(placementId, evaluationData) {
  return apiFetch(`/evaluation/`, {
    method: "POST",
    body: JSON.stringify({ placement: placementId, ...evaluationData }),
  });
}

export async function getMyPlacement() {
  return apiFetch("/placements/my-placement/");
}