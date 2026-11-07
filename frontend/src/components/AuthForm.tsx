import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

interface AuthFormProps {
  mode: "login" | "register";
  onSuccess: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const result = isLogin
      ? await api.POST("/auth/login", { body: { email, password } })
      : await api.POST("/auth/register", { body: { email, password } });

    setLoading(false);

    if (result.response.ok && result.data) {
      login(result.data.token, result.data.email);
      onSuccess();
    } else {
      const fallbackMsg = isLogin
        ? "Nieprawidłowy e-mail lub hasło."
        : "Błąd rejestracji. Spróbuj ponownie.";
      const detail =
        result.error && typeof result.error === "object" && "detail" in result.error
          ? (result.error as { detail?: string }).detail ?? fallbackMsg
          : fallbackMsg;
      setErrorMessage(detail);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-center text-slate-100 mb-6">
          {isLogin ? "Zaloguj się do Zakopu" : "Utwórz konto w Zakop"}
        </h2>

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
              minLength={isLogin ? undefined : 6}
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
            {loading ? (isLogin ? "Logowanie..." : "Rejestracja...") : isLogin ? "Zaloguj się" : "Zarejestruj się"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 mt-6">
          {isLogin ? (
            <>
              Nie masz jeszcze konta?{" "}
              <Link to="/register" className="text-orange-500 hover:underline font-semibold">
                Zarejestruj się
              </Link>
            </>
          ) : (
            <>
              Masz już konto?{" "}
              <Link to="/login" className="text-orange-500 hover:underline font-semibold">
                Zaloguj się
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
