
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const DEFAULT_CREDENTIALS = {
  email: "admin@tasktracker.com",
  password: "123456"
};

export const authenticateUser = (email: string, password: string): User | null => {
  if (email === DEFAULT_CREDENTIALS.email && password === DEFAULT_CREDENTIALS.password) {
    const user: User = {
      id: "1",
      name: "Administrador",
      email: email,
      role: "admin"
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null;
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};
