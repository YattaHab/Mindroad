// Get the stored token
export const getToken = () => localStorage.getItem("token");

// Check if logged in
export const isLoggedIn = () => !!getToken();

// Get the current user object
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Save after login
export const saveAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Clear on logout
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
