"use client"

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Loader2, Save } from 'lucide-react';

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}

function FormField({ id, label, type = "text", placeholder, value, onChange, required }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium" style={{ color: "#a8c4a8" }}>
        {label} {required && <span style={{ color: "#d4af37" }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(212,175,55,0.18)",
          color: "#e8f0e8",
        }}
        onFocus={e => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)"; }}
        onBlur={e => { e.target.style.borderColor = "rgba(212,175,55,0.18)"; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

export default function AddEmployee() {
  const [form, setForm] = useState({
    fullName: '', nipy: '', birthplace: '', birthdate: '', email: '', whatsappNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const set = (key: keyof typeof form) => (v: string) => setForm(prev => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.from('employees').insert({
      full_name: form.fullName,
      nipy: form.nipy,
      birthplace: form.birthplace,
      birthdate: form.birthdate || null,
      email: form.email,
      whatsapp_number: form.whatsappNumber,
    });

    setLoading(false);
    if (error) setError(error.message);
    else router.push('/dashboard/employees');
  };

  return (
    <div className="max-w-2xl">
      {/* Back link */}
      <Link href="/dashboard/employees"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
        style={{ color: "#4a7a4a" }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#22c55e"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#4a7a4a"}>
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Pegawai
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(21,128,61,0.3), rgba(13,148,136,0.2))", border: "1px solid rgba(21,128,61,0.3)" }}>
          <UserPlus className="w-5 h-5" style={{ color: "#22c55e" }} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#4a7a4a" }}>Form</p>
          <h1 className="text-xl font-bold" style={{ color: "#e8f0e8" }}>Tambah Guru / Karyawan</h1>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(17,26,17,0.9), rgba(10,18,15,0.9))",
          border: "1px solid rgba(212,175,55,0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}>
        <div className="h-0.5" style={{ background: "linear-gradient(90deg, #15803d, #d4af37, #0d9488)" }} />

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField id="fullName" label="Nama Lengkap" placeholder="Masukkan nama lengkap" value={form.fullName} onChange={set('fullName')} required />
            </div>
            <FormField id="nipy" label="NIPY" placeholder="Nomor Induk Pegawai Yayasan" value={form.nipy} onChange={set('nipy')} />
            <FormField id="email" label="Email" type="email" placeholder="nama@sekolah.sch.id" value={form.email} onChange={set('email')} />
            <FormField id="birthplace" label="Tempat Lahir" placeholder="Kota kelahiran" value={form.birthplace} onChange={set('birthplace')} />
            <FormField id="birthdate" label="Tanggal Lahir" type="date" value={form.birthdate} onChange={set('birthdate')} />
            <div className="sm:col-span-2">
              <FormField id="whatsappNumber" label="Nomor WhatsApp" placeholder="08xxxxxxxxxx" value={form.whatsappNumber} onChange={set('whatsappNumber')} />
            </div>
          </div>

          {error && (
            <div className="rounded-xl p-4 text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: loading ? "rgba(212,175,55,0.4)" : "linear-gradient(135deg, #b8970a, #d4af37)",
                color: "#0a0f0a",
                boxShadow: loading ? "none" : "0 4px 15px rgba(212,175,55,0.25)",
                cursor: loading ? "not-allowed" : "pointer",
              }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
