"use client"

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Users, Plus, Loader2, Mail, CreditCard, User } from 'lucide-react';

interface Employee {
  id: number;
  full_name: string;
  nipy: string;
  email: string;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('employees').select('id, full_name, nipy, email');
      if (error) setError(error.message);
      else setEmployees(data);
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3">
      <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#d4af37" }} />
      <span className="text-sm" style={{ color: "#4a7a4a" }}>Memuat data...</span>
    </div>
  );

  if (error) return (
    <div className="rounded-xl p-4 text-sm"
      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
      {error}
    </div>
  );

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#4a7a4a" }}>Dashboard</p>
          <h1 className="text-2xl font-bold" style={{ color: "#e8f0e8" }}>Guru & Karyawan</h1>
        </div>
        <Link href="/dashboard/add-employee"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #b8970a, #d4af37)",
            color: "#0a0f0a",
            boxShadow: "0 4px 15px rgba(212,175,55,0.25)",
          }}>
          <Plus className="w-4 h-4" />
          Tambah
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Pegawai", value: employees.length, icon: Users, color: "#22c55e", bg: "rgba(21,128,61,0.15)" },
          { label: "Dengan NIPY", value: employees.filter(e => e.nipy).length, icon: CreditCard, color: "#d4af37", bg: "rgba(212,175,55,0.1)" },
          { label: "Dengan Email", value: employees.filter(e => e.email).length, icon: Mail, color: "#14b8a6", bg: "rgba(13,148,136,0.15)" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4"
            style={{ background: "rgba(17,26,17,0.8)", border: "1px solid rgba(212,175,55,0.1)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: stat.bg }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs" style={{ color: "#4a7a4a" }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(17,26,17,0.9), rgba(10,18,15,0.9))",
          border: "1px solid rgba(212,175,55,0.15)",
        }}>
        <div className="h-0.5" style={{ background: "linear-gradient(90deg, #15803d, #d4af37, #0d9488)" }} />

        {employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(21,128,61,0.1)", border: "1px solid rgba(21,128,61,0.2)" }}>
              <Users className="w-7 h-7" style={{ color: "#15803d" }} />
            </div>
            <p className="text-sm" style={{ color: "#4a7a4a" }}>Belum ada data pegawai</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
                {["Nama Lengkap", "NIPY", "Email"].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#4a7a4a" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={emp.id}
                  className="transition-colors"
                  style={{ borderBottom: idx < employees.length - 1 ? "1px solid rgba(212,175,55,0.06)" : "none" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(21,128,61,0.05)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: "linear-gradient(135deg, rgba(21,128,61,0.3), rgba(13,148,136,0.2))", color: "#22c55e", border: "1px solid rgba(21,128,61,0.3)" }}>
                        {emp.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium" style={{ color: "#d1e8d1" }}>{emp.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono px-2 py-0.5 rounded"
                      style={{ background: "rgba(212,175,55,0.08)", color: "#d4af37" }}>
                      {emp.nipy || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm" style={{ color: emp.email ? "#14b8a6" : "#4a7a4a" }}>
                      {emp.email || '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
