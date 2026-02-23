"use client"

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Loader2, Save, Upload, ImageIcon } from 'lucide-react';

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string;
}

function FormField({ id, label, type = "text", placeholder, value, onChange, step }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium" style={{ color: "#a8c4a8" }}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        step={step}
        className="w-full h-11 px-4 rounded-xl text-sm outline-none transition-all duration-200"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.18)", color: "#e8f0e8" }}
        onFocus={e => { e.target.style.borderColor = "rgba(212,175,55,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)"; }}
        onBlur={e => { e.target.style.borderColor = "rgba(212,175,55,0.18)"; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

export default function EditSchool() {
  const [school, setSchool] = useState({
    name: '', address: '', logo_url: '', latitude: '', longitude: '', phone_number: '', website: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const { data, error } = await supabase.from('schools').select('*').eq('id', 1).single();
        if (error) {
          if (error.code !== 'PGRST116' && !error.message?.includes('0 rows')) console.error(error);
        } else if (data) {
          setSchool({
            name: data.name || '', address: data.address || '', logo_url: data.logo_url || '',
            latitude: data.latitude?.toString() || '', longitude: data.longitude?.toString() || '',
            phone_number: data.phone_number || '', website: data.website || '',
          });
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSchool();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSchool(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let newLogoUrl = school.logo_url;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('school-logos').upload(fileName, logoFile, { upsert: true });

        if (uploadError) throw new Error('Gagal mengupload logo: ' + uploadError.message);
        if (!uploadData) throw new Error('Upload logo gagal.');

        const { data: urlData } = supabase.storage.from('school-logos').getPublicUrl(uploadData.path);
        newLogoUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from('schools').update({
        name: school.name, address: school.address, phone_number: school.phone_number,
        website: school.website,
        latitude: school.latitude === '' ? null : parseFloat(school.latitude),
        longitude: school.longitude === '' ? null : parseFloat(school.longitude),
        logo_url: newLogoUrl,
      }).eq('id', 1);

      if (error) throw new Error('Gagal menyimpan: ' + error.message);

      alert('Informasi sekolah berhasil disimpan!');
      setSchool(prev => ({ ...prev, logo_url: newLogoUrl }));
      setLogoFile(null);
      router.push('/dashboard/school-profile');
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3">
      <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#d4af37" }} />
      <span className="text-sm" style={{ color: "#4a7a4a" }}>Memuat data...</span>
    </div>
  );

  const previewUrl = logoFile ? URL.createObjectURL(logoFile) : school.logo_url;

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <Link href="/dashboard/school-profile"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
        style={{ color: "#4a7a4a" }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#22c55e"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#4a7a4a"}>
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Profil Sekolah
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.1))", border: "1px solid rgba(212,175,55,0.3)" }}>
          <Building2 className="w-5 h-5" style={{ color: "#d4af37" }} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#4a7a4a" }}>Form</p>
          <h1 className="text-xl font-bold" style={{ color: "#e8f0e8" }}>Edit Informasi Sekolah</h1>
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
          {/* Logo upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium" style={{ color: "#a8c4a8" }}>Logo Sekolah</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "2px dashed rgba(212,175,55,0.25)" }}>
                {previewUrl ? (
                  <img src={`${previewUrl}${!logoFile ? `?t=${Date.now()}` : ''}`} alt="Logo"
                    className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-7 h-7" style={{ color: "#3a5a3a" }} />
                )}
              </div>
              <div>
                <label htmlFor="logo"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all"
                  style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", color: "#d4af37" }}>
                  <Upload className="w-4 h-4" />
                  {logoFile ? 'Ganti File' : 'Pilih File'}
                </label>
                <input id="logo" type="file" className="hidden"
                  onChange={e => e.target.files?.[0] && setLogoFile(e.target.files[0])}
                  accept="image/png, image/jpeg, image/svg+xml" />
                {logoFile && (
                  <p className="text-xs mt-1.5" style={{ color: "#14b8a6" }}>✓ {logoFile.name}</p>
                )}
                <p className="text-xs mt-1" style={{ color: "#3a5a3a" }}>PNG, JPG, SVG</p>
              </div>
            </div>
          </div>

          <div className="h-px" style={{ background: "rgba(212,175,55,0.08)" }} />

          {/* Fields */}
          <div className="space-y-5">
            <FormField id="name" label="Nama Sekolah *" placeholder="Contoh: SMA Negeri 1 Model" value={school.name} onChange={handleChange} />
            <FormField id="address" label="Alamat" placeholder="Jl. Pendidikan No. 1" value={school.address} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <FormField id="phone_number" label="Nomor Telepon" placeholder="021-1234567" value={school.phone_number} onChange={handleChange} />
              <FormField id="website" label="Website" placeholder="https://sekolah.sch.id" value={school.website} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField id="latitude" label="Latitude" type="number" step="any" placeholder="-6.200000" value={school.latitude} onChange={handleChange} />
              <FormField id="longitude" label="Longitude" type="number" step="any" placeholder="106.816666" value={school.longitude} onChange={handleChange} />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: saving ? "rgba(212,175,55,0.4)" : "linear-gradient(135deg, #b8970a, #d4af37)",
                color: "#0a0f0a",
                boxShadow: saving ? "none" : "0 4px 15px rgba(212,175,55,0.25)",
                cursor: saving ? "not-allowed" : "pointer",
              }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Menyimpan..." : "Simpan Informasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
