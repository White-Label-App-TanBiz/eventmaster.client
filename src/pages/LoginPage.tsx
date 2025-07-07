import React, { useState, useEffect } from "react";
import { Building2, Eye, EyeOff, LogIn, Loader2, Code, ExternalLink } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { showError, showSuccess } = useNotifications();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.email.trim()) {
      showError("Email required", "Please enter your email address.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.password.trim()) {
      showError("Password required", "Please enter your password.");
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError("Invalid email format", "Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        showSuccess("Login successful!", "Welcome back to EventMaster.");
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        showError("Login failed", "Invalid email or password. Please check your credentials and try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      showError("Login error", "An unexpected error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const demoAccounts = [
    { email: "admin@eventmaster.com", role: "Super Admin", description: "Full system access" },
    { email: "client@techcorp.com", role: "Client Admin", description: "Manage product plans and organizers" },
    { email: "organizer@events.com", role: "Organizer", description: "Manage events and attendees" },
    { email: "staff@eventmaster.com", role: "Admin", description: "Help organizer to manage events" },
    { email: "attendee@example.com", role: "Attendee", description: "Register for events and receive notifications" },
  ];

  const fillDemoAccount = (email: string) => {
    setFormData({ email, password: "password123" });
    showSuccess("Demo account filled", `Credentials for ${email} have been filled in.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-700 rounded-xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Welcome to EventMaster</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">Sign in to your account to continue</p>
        </div>
        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all"
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300" disabled={isSubmitting}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          {/* Submit Button with proper loading states */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign in</span>
              </>
            )}
          </button>
        </form>
        {/* White-Label Installation Demo */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Code className="w-6 h-6 text-blue-700 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">White-Label Installation</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">Want to install EventMaster on your own server with your own branding? Try our white-label installation flow demo.</p>
          <Link to="/white-label-setup" className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm transition-colors">
            <ExternalLink className="w-4 h-4" />
            <span>Try White-Label Setup Demo</span>
          </Link>
        </div>
        {/* Demo Accounts */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-zinc-950 text-gray-500 dark:text-zinc-400">Demo Accounts</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => fillDemoAccount(account.email)}
                disabled={isSubmitting}
                className="w-full text-left p-3 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{account.role}</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400">{account.email}</div>
                    <div className="text-xs text-gray-400 dark:text-zinc-500">{account.description}</div>
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-400">Click to fill</div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              All demo accounts use password: <code className="bg-gray-100 dark:bg-zinc-800 px-1 rounded font-mono">password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
