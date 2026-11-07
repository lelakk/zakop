import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

interface RegisterViewProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onSuccess, onNavigateLogin }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const { data, error, response } = await api.POST("/auth/register", {
      body: { email, password },
    });

    setLoading(false);

    if (response.ok && data) {
      login(data.token, data.email);
      onSuccess();
    } else {
      const detail = error && "detail" in error ? (error.detail as string) : "Błąd rejestracji. Spróbuj ponownie.";
      setErrorMessage(detail);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-center text-slate-100 mb-6">Utwórz konto w Zakop</h2>

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Hasło</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold text-sm text-white transition disabled:opacity-50"
          >
            {loading ? "Rejestracja..." : "Zarejestruj się"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 mt-6">
          Masz już konto?{" "}
          <button onClick={onNavigateLogin} className="text-orange-500 hover:underline font-semibold">
            Zaloguj się
          </button>
        </p>
      </div>
    </div>
  );
};
