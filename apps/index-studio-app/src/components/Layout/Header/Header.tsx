import { useEffect, useRef, useState } from "react";
import { Bell, LogOut, Search, Settings, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@sgx/ui";
import { getCurrentUser, logout } from "@/api/auth.api";

interface HeaderComponentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Header = ({ searchTerm, setSearchTerm }: HeaderComponentProps) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between shadow-md">
      {/* Search Section */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Indices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent"
          />
          {searchTerm && (
            <Button
              variant="neutral"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0! text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4 ml-4">
        <Button
          variant={"white"}
          size="sm"
          radius="md"
          className="p-2!"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </Button>

        <Button
          variant={"white"}
          size="sm"
          radius="md"
          className="p-2!"
          aria-label="Settings"
          onClick={() => navigate("/ui-components")}
        >
          <Settings className="w-5 h-5" />
        </Button>

        {/* User Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-8 h-8 rounded-full bg-[#1a3a5c] text-white flex items-center justify-center text-sm font-semibold hover:bg-[#0f2844] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:ring-offset-2"
            aria-label="User menu"
            aria-expanded={open}
          >
            {initials}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-lg z-50 py-1">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name ?? "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email ?? ""}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
