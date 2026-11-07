import React from "react";
import { Flame, LogIn, UserPlus, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar: React.FC = () => {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-orange-500 font-black text-xl tracking-tight hover:opacity-90 transition"
        >
          <Flame className="w-6 h-6 fill-orange-500" />
          <span>ZAKOP</span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-slate-400">
                Zalogowano: <strong className="text-slate-200">{userEmail}</strong>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <LogOut className="w-4 h-4" /> Wyloguj
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <LogIn className="w-4 h-4" /> Zaloguj
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-medium transition"
              >
                <UserPlus className="w-4 h-4" /> Rejestracja
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
