"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ChefHat } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirect = searchParams.get("redirect") || "/cliente/menu";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      login(data.user);
      router.push(redirect);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Iniciar Sesión</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Tu contraseña"
              className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#dc2626]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#dc2626] text-white rounded-xl font-bold hover:bg-[#991b1b] transition-colors disabled:opacity-50"
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link href="/cliente/registro" className="text-[#dc2626] font-bold hover:underline">
          Regístrate
        </Link>
      </p>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <Link href="/cliente/menu" className="block text-center text-gray-500 hover:text-[#dc2626]">
          Ver menú sin iniciar sesión
        </Link>
      </div>
    </div>
  );
}

function LoginLoading() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="h-14 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dc2626] via-[#991b1b] to-[#7f1d1d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <ChefHat className="w-12 h-12 text-white" />
            <span className="text-4xl font-black text-white">KROKORI</span>
          </Link>
          <p className="text-white/80 mt-2">Inicia sesión para hacer tu pedido</p>
        </div>

        <Suspense fallback={<LoginLoading />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
