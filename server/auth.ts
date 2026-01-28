import type { Express, Request, Response, NextFunction } from "express";

// Simple demo auth middleware - for demonstration purposes only
// In a real app, you would implement proper authentication

// Demo user for testing
const DEMO_USER = {
  id: "demo-user-1",
  email: "demo@example.com",
  firstName: "Demo",
  lastName: "User",
  claims: {
    sub: "demo-user-1",
    email: "demo@example.com",
    first_name: "Demo",
    last_name: "User"
  }
};

export function setupDemoAuth(app: Express) {
  // Middleware to attach demo user to all requests
  app.use((req: any, res: Response, next: NextFunction) => {
    // For demo purposes, always consider user authenticated
    req.user = DEMO_USER;
    req.isAuthenticated = () => true;
    next();
  });

  // Demo login endpoint - just returns success
  app.get("/api/login", (req, res) => {
    res.json({ message: "Demo login successful", user: DEMO_USER });
  });

  // Demo logout endpoint
  app.get("/api/logout", (req, res) => {
    res.json({ message: "Demo logout successful" });
  });

  // Demo user info endpoint
  app.get("/api/auth/user", (req, res) => {
    res.json((req as any).user || null);
  });
}