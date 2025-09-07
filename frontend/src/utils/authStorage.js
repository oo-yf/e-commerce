export const getToken = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch {
    return null;
  }
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuth = ({ token, user }) => {
  try {
    if (token) localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
  } catch {
    // no-op
  }
};

export const clearAuth = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
  } catch {
    // no-op
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return typeof payload.exp === "number" ? payload.exp <= now : true;
  } catch {
    return true;
  }
};