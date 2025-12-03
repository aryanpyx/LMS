import { useState } from "react";
import { useRouter } from "next/router";

export default function Header({ role, userName, onToggleSidebar }) {
  const [notifications, setNotifications] = useState(3);
  const [messages, setMessages] = useState(2);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case "student":
        return "Student";
      case "instructor":
        return "Instructor";
      case "admin":
        return "Administrator";
      default:
        return "User";
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-neutral-200 px-8 py-4 shadow-soft">
      <div className="flex items-center justify-between">
        {/* Left side - Breadcrumb/Title */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">
              {getRoleDisplay(role)} Dashboard
            </h1>
            <p className="text-sm text-neutral-600">
              Welcome back, {userName}!
            </p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <span className="text-xl">☰</span>
          </button>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="w-64 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-neutral-400">🔍</span>
            </div>
          </div>

          {/* Messages */}
          <div className="relative">
            <button
              onClick={() => setMessageOpen(!messageOpen)}
              aria-haspopup="true"
              aria-expanded={messageOpen}
              className="relative p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <span className="text-xl">💬</span>
              {messages > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {messages}
                </span>
              )}
            </button>

            {messageOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-medium border border-neutral-200 py-2 z-50">
                <div className="px-4 py-2 text-sm font-medium text-neutral-900">
                  Messages
                </div>
                <div className="divide-y divide-neutral-100">
                  <div className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">You have a new message from John Doe.</div>
                  <div className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Reminder: Project deadline is tomorrow.</div>
                </div>
                <div
                  className="px-4 py-2 text-xs text-primary-600 hover:text-primary-700 cursor-pointer"
                  onClick={() => {
                    router.push("/messages");
                    setMessageOpen(false);
                  }}
                >
                  View all messages
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              aria-haspopup="true"
              aria-expanded={notificationOpen}
              className="relative p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <span className="text-xl">🔔</span>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-medium border border-neutral-200 py-2 z-50">
                <div className="px-4 py-2 text-sm font-medium text-neutral-900">
                  Notifications
                </div>
                <div className="divide-y divide-neutral-100">
                  <div className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">New message from instructor</div>
                  <div className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Course update: React Advanced</div>
                  <div className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Payment receipt available</div>
                </div>
                <div className="px-4 py-2 text-xs text-primary-600 hover:text-primary-700 cursor-pointer">View all</div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-neutral-900">
                  {userName}
                </p>
                <p className="text-xs text-neutral-500 capitalize">{role}</p>
              </div>
              <span
                className={`transform transition-transform duration-200 opacity-0 group-hover:opacity-100 ${dropdownOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
