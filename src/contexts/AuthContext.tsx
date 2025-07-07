import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "super_admin" | "client_admin" | "organizer" | "admin" | "attendee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const mockUsers: Record<string, User> = {
  "admin@eventmaster.com": {
    id: "1",
    name: "Alex Thompson",
    email: "admin@eventmaster.com",
    role: "super_admin",
    avatar: "AT",
    permissions: ["*"],
  },
  "client@techcorp.com": {
    id: "2",
    name: "Sarah Johnson",
    email: "client@techcorp.com",
    role: "client_admin",
    avatar: "SJ",
    company: "TechCorp Events",
    permissions: ["plans.manage", "organizers.manage", "payments.manage", "analytics.view", "branding.manage"],
  },
  "organizer@events.com": {
    id: "3",
    name: "Michael Chen",
    email: "organizer@events.com",
    role: "organizer",
    avatar: "MC",
    company: "Event Solutions",
    permissions: ["events.manage", "attendees.manage", "admins.manage", "analytics.view"],
  },
  "staff@eventmaster.com": {
    id: "4",
    name: "Emma Rodriguez",
    email: "staff@eventmaster.com",
    role: "admin",
    avatar: "ER",
    permissions: ["events.view", "attendees.view", "events.edit"],
  },
  "attendee@example.com": {
    id: "5",
    name: "John Doe",
    email: "attendee@example.com",
    role: "attendee",
    avatar: "JD",
    permissions: ["events.register", "profile.manage"],
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("eventmaster_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (mockUsers[parsedUser.email]) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("eventmaster_user");
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("eventmaster_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const normalizedEmail = email.toLowerCase().trim();
      const mockUser = mockUsers[normalizedEmail];

      if (mockUser && password === "password123") {
        setUser(mockUser);
        localStorage.setItem("eventmaster_user", JSON.stringify(mockUser));
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eventmaster_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
