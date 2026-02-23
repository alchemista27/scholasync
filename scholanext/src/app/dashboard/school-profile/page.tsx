"use client"

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Pencil, MapPin, Phone, Globe, Building2, Loader2 } from 'lucide-react';

interface School {
  name: string;
  address: string | null;
  logo_url: string | null;
  latitude: number | null;
  longitude: number | null;
  phone_number: string | null;
  website: string | null;
}

function InfoRow({ icon: Icon, label, value, isLink }: {
  icon: React.ElementType;
  label: string;
  value: string | number | null;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl transition-colors"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.08)" }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(21,128,61,0.15)", border: "1px solid rgba(21,128,61,0.2)" }}>
        <Icon className="w-4 h-4" style={{ color: "#22c55e" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#4a7a4a" }}>{label}</p>
        {isLink && value ? (
          <a href={value as string} target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium truncate hover:underline"
            style={{ color: "#14b8a6" }}>
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium" style={{ color: value ? "#d1e8d1" : "#4a7a4a" }}>
            {value ?? '—'}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SchoolProfile() {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  useEffect(() => {
    const fetchSchool = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('schools').select('*').eq('id', 1).single();
        if (error) {
          if (error.code !== 'PGRST116' && !error.message?.includes('0 rows')) console.error(error);
        } else if (data) setSchool(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSchool();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3" style={{ color: "#4a7a4a" }}>
      <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#d4af37" }} />
      <span className="text-sm">Memuat data sekolah...</span>
    </div>
  );

  if (!school) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(21,128,61,0.1)", border: "1px solid rgba(21,128,61,0.2)" }}>
        <Building2 className="w-8 h-8" style={{ color: "#15803d" }} />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-1" style={{ color: "#a8c4a8" }}>Belum ada data sekolah</h2>
        <p className="text-sm mb-4" style={{ color: "#4a7a4a" }}>Data profil sekolah belum ditambahkan.</p>
      </div>
      {role === 'admin' && (
        <Link href="/dashboard/edit-school"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "linear-gradient(135deg, #b8970a, #d4af37)", color: "#0a0f0a", boxShadow: "0 4px 15px rgba(212,175,55,0.25)" }}>
          <Pencil className="w-4 h-4" />
          Tambah Informasi Sekolah
        </Link>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#4a7a4a" }}>Dashboard</p>
          <h1 className="text-2xl font-bold" style={{ color: "#e8f0e8" }}>Profil Sekolah</h1>
        </div>
        {role === 'admin' && (
          <Link href="/dashboard/edit-school"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.25)",
              color: "#d4af37",
            }}>
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Link>
        )}
      </div>

      {/* Main card */}
      <div className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(17,26,17,0.9), rgba(10,18,15,0.9))",
          border: "1px solid rgba(212,175,55,0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}>
        {/* Card header with gold line */}
        <div className="h-0.5" style={{ background: "linear-gradient(90deg, #15803d, #d4af37, #0d9488)" }} />

        <div className="p-6">
          {/* School identity */}
          <div className="flex items-center gap-5 mb-6">
            {school.logo_url ? (
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0"
                style={{ border: "2px solid rgba(212,175,55,0.3)", boxShadow: "0 0 20px rgba(212,175,55,0.1)" }}>
                <img src={school.logo_url} alt="Logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(21,128,61,0.2), rgba(13,148,136,0.2))", border: "2px solid rgba(21,128,61,0.3)" }}>
                <Building2 className="w-9 h-9" style={{ color: "#22c55e" }} />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold leading-tight" style={{ color: "#e8f0e8" }}>{school.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: "rgba(21,128,61,0.15)", border: "1px solid rgba(21,128,61,0.3)", color: "#22c55e" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ boxShadow: "0 0 4px #22c55e" }} />
                  Aktif
                </span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid gap-3">
            <InfoRow icon={MapPin} label="Alamat" value={school.address} />
            <InfoRow icon={Phone} label="Nomor Telepon" value={school.phone_number} />
            <InfoRow icon={Globe} label="Website" value={school.website} isLink />
            <div className="grid grid-cols-2 gap-3">
              <InfoRow icon={MapPin} label="Latitude" value={school.latitude} />
              <InfoRow icon={MapPin} label="Longitude" value={school.longitude} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
