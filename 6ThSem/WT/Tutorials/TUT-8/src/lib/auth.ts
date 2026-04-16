// Local authentication utilities

export interface AuthUser {
  id: string;
  username: string;
}

const TOKEN_KEY = "chronicle_token";
const USER_KEY = "chronicle_user";

export const auth = {
  login: async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  getUser: (): AuthUser | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  verify: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await fetch("/api/auth/verify", {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return null;
      }

      return (await response.json()).user;
    } catch (error) {
      return null;
    }
  },
};
