import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQuickAccess, setShowQuickAccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Clear any existing tokens when accessing login page
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call with mock data
    setTimeout(() => {
      if (email === "admin@example.com" && password === "admin") {
        localStorage.setItem("token", "mock-admin-token");
        localStorage.setItem("role", "admin");
        router.push("/admin/dashboard");
      } else if (
        email === "instructor@example.com" &&
        password === "instructor"
      ) {
        localStorage.setItem("token", "mock-instructor-token");
        localStorage.setItem("role", "instructor");
        router.push("/instructor/dashboard");
      } else if (
        email === "student@example.com" &&
        password === "student"
      ) {
        localStorage.setItem("token", "mock-student-token");
        localStorage.setItem("role", "student");
        router.push("/student/dashboard");
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 1000);
  };

  const handleDevAccess = (role) => {
    if (process.env.NODE_ENV === "development") {
      localStorage.setItem("token", `dev-${role}-token`);
      localStorage.setItem("role", role);
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "instructor") {
        router.push("/instructor/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } else {
      alert("Development access is only available in development environment.");
    }
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Login Form (Wider) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-400 to-cyan-600 rounded-xl mb-4 shadow-lg">
              <span className="text-3xl">🎓</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          </div>

          {/* Enhanced Login Box with Shadow and Border */}
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-8 lg:p-10">
            <h2 className="hidden lg:block text-3xl font-bold text-slate-900 mb-2">Sign in to your account</h2>
            <p className="hidden lg:block text-slate-600 mb-8">Enter your credentials to access the dashboard</p>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative text-sm" role="alert">
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline"> {error}</span>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowQuickAccess(!showQuickAccess)}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200"
                >
                  {showQuickAccess ? "Hide Quick Access" : "Show Quick Access"}
                </button>
              </div>

              {showQuickAccess && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-center text-sm text-gray-600">
                    Quick access for development (will only work in development environment):
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleDevAccess("student")}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Student
                    </button>
                    <button
                      onClick={() => handleDevAccess("instructor")}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Instructor
                    </button>
                    <button
                      onClick={() => handleDevAccess("admin")}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Admin
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

      {/* Right Panel - Branding & Info (Narrower) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]"></div>
        <div className="relative z-10 text-center max-w-lg">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-teal-400 to-cyan-600 rounded-2xl mb-8 shadow-2xl">
            <span className="text-5xl">🎓</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">LMS Platform</h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Empowering educators and engaging students with a comprehensive, modern learning management system.
          </p>
          <div className="mt-8 flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400">1000+</div>
              <div className="text-sm text-slate-400">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">50k+</div>
              <div className="text-sm text-slate-400">Students</div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Development Access</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => handleDevAccess('student')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Student
            </button>
            <button
              onClick={() => handleDevAccess('instructor')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Instructor
            </button>
            <button
              onClick={() => handleDevAccess('admin')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
