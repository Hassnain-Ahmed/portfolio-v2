import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  const { session, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-lg">
        <div>
          <h1 className="text-xl font-semibold text-white">Admin Login</h1>
          <p className="text-sm text-gray-500">Sign in to manage your portfolio</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-400">{error}</div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-purple-600 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
