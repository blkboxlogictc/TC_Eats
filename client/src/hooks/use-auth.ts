import { useState, useEffect } from "react";
import { DEMO_USER } from "../data/demo-data";
import type { User } from "@shared/models/auth";

export function useAuth() {
  // Always return the demo user as logged in
  const [user] = useState<User>(DEMO_USER);
  const [isLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = () => {
    setIsLoggingOut(true);
    // Simulate logout delay
    setTimeout(() => {
      setIsLoggingOut(false);
      // In a real app, this would redirect or clear user state
      // For demo, we keep the user logged in
    }, 1000);
  };

  return {
    user,
    isLoading,
    isAuthenticated: true, // Always authenticated in demo mode
    logout,
    isLoggingOut,
  };
}
