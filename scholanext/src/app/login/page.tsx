"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { School, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('logo_url, name')
          .eq('id', 1)
          .single();

        if (!error && data?.logo_url) {
          setLogoUrl(data.logo_url);
        }
      } catch {
        // logo bersifat opsional
      }
    };
    fetchLogo();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.refresh();
      router.push("/dashboard");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0f0a 0%, #0d1a0d 50%, #0a1210 100%)" }}>

      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #15803d, transparent)" }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #0d9488, transparent)" }} />
        <div className="absolute top-[40%] left-[10%] w-48 h-48 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #d4af37, transparent)" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-2xl border overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(17,26,17,0.97) 0%, rgba(10,18,15,0.97) 100%)",
            borderColor: "rgba(212,175,55,0.25)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.08), inset 0 1px 0 rgba(212,175,55,0.1)"
          }}>

          {/* Top gold accent line */}
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #15803d, #d4af37, #0d9488)" }} />

          <div className="p-8 pt-7">
            {/* Logo / Icon */}
            <div className="flex flex-col items-center mb-8">
              {logoUrl ? (
                <div className="w-20 h-20 rounded-2xl overflow-hidden border mb-4"
                  style={{ borderColor: "rgba(212,175,55,0.3)", boxShadow: "0 0 20px rgba(212,175,55,0.15)" }}>
                  <img src={`${logoUrl}?t=${Date.now()}`} alt="Logo Sekolah"
                    className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, #15803d, #0d9488)", boxShadow: "0 0 20px rgba(21,128,61,0.3)" }}>
                  <School className="w-8 h-8 text-white" />
                </div>
              )}
              <h1 className="text-2xl font-bold tracking-tight"
                style={{ background: "linear-gradient(90deg, #d4af37, #f0cc4a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                ScholaSync
              </h1>
              <p className="text-sm mt-1" style={{ color: "#6b8f6b" }}>
                Admin Dashboard
              </p>
            </div>

            {/* Divider */}
            <div className="border-b mb-6" style={{ borderColor: "rgba(212,175,55,0.12)" }} />

            {/* Form */}
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium" style={{ color: "#a8c4a8" }}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@sekolah.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-11 transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    color: "#e8f0e8",
                    outline: "none",
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium" style={{ color: "#a8c4a8" }}>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-11 pr-11 transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(212,175,55,0.2)",
                      color: "#e8f0e8",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#6b8f6b" }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg px-4 py-3 text-sm"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                  {error}
                </div>
              )}

              <Button
                className="w-full h-11 font-semibold text-sm transition-all duration-200 mt-2"
                onClick={handleLogin}
                disabled={loading}
                style={{
                  background: loading ? "rgba(212,175,55,0.5)" : "linear-gradient(135deg, #b8970a, #d4af37)",
                  color: "#0a0f0a",
                  boxShadow: loading ? "none" : "0 4px 15px rgba(212,175,55,0.3)",
                  border: "none",
                }}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Masuk...
                  </span>
                ) : "Masuk"}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-xs" style={{ color: "#4a6b4a" }}>
              © {new Date().getFullYear()} ScholaSync · Sistem Informasi Sekolah
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
