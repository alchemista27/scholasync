"use client"

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { School, Users, LogOut, LayoutDashboard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/dashboard/school-profile', label: 'Profil Sekolah', icon: School },
  { href: '/dashboard/employees', label: 'Guru & Karyawan', icon: Users },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { role } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-full w-64 relative"
      style={{
        background: "linear-gradient(180deg, #0d1a0d 0%, #0a1210 100%)",
        borderRight: "1px solid rgba(212,175,55,0.15)",
      }}>

      {/* Top accent line */}
      <div className="h-0.5 w-full flex-shrink-0"
        style={{ background: "linear-gradient(90deg, #15803d, #d4af37, #0d9488)" }} />

      {/* Logo */}
      <div className="px-6 py-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #15803d, #0d9488)", boxShadow: "0 0 12px rgba(21,128,61,0.4)" }}>
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-base tracking-tight leading-none"
              style={{ background: "linear-gradient(90deg, #d4af37, #f0cc4a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              ScholaSync
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#4a7a4a" }}>Admin Panel</p>
          </div>
        </div>

        {/* Role badge */}
        {role && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              background: role === 'admin' ? "rgba(212,175,55,0.12)" : "rgba(13,148,136,0.12)",
              border: `1px solid ${role === 'admin' ? "rgba(212,175,55,0.3)" : "rgba(13,148,136,0.3)"}`,
              color: role === 'admin' ? "#d4af37" : "#14b8a6",
            }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: role === 'admin' ? "#d4af37" : "#14b8a6" }} />
            {role}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 mb-4 h-px flex-shrink-0" style={{ background: "rgba(212,175,55,0.1)" }} />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "#3a5a3a" }}>
          Menu
        </p>
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
              )}
              style={isActive ? {
                background: "linear-gradient(135deg, rgba(21,128,61,0.25), rgba(13,148,136,0.15))",
                border: "1px solid rgba(21,128,61,0.3)",
                color: "#22c55e",
              } : {
                color: "#6b8f6b",
                border: "1px solid transparent",
              }}>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200")}
                style={isActive ? {
                  background: "linear-gradient(135deg, rgba(21,128,61,0.4), rgba(13,148,136,0.3))",
                } : {
                  background: "rgba(255,255,255,0.04)",
                }}>
                <Icon className="w-4 h-4" />
              </div>
              {link.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex-shrink-0 p-3">
        <div className="mx-1 mb-3 h-px" style={{ background: "rgba(212,175,55,0.1)" }} />
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ color: "#6b5a3a", border: "1px solid transparent" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.08)";
            (e.currentTarget as HTMLElement).style.color = "#d4af37";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.2)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#6b5a3a";
            (e.currentTarget as HTMLElement).style.borderColor = "transparent";
          }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <LogOut className="w-4 h-4" />
          </div>
          Keluar
        </button>
      </div>
    </div>
  );
}
