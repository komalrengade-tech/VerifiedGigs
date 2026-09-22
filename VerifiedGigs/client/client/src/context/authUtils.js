export const getRoleDashboard = (role) => {
  switch (role) {
    case "STUDENT":
      return "/student/dashboard";
    case "CLIENT":
      return "/client/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/";
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return true;
    const decodedJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(decodedJson);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const getInitialAuthState = () => {
  try {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      if (isTokenExpired(storedToken)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return { token: null, user: null };
      }
      return { token: storedToken, user: JSON.parse(storedUser) };
    }
  } catch (err) {
    console.error("Error initializing auth state:", err);
  }
  return { token: null, user: null };
};

