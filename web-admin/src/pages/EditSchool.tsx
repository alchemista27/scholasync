import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function EditSchool() {
  const [school, setSchool] = useState({
    name: '',
    address: '',
    logo_url: '',
    latitude: '',
    longitude: '',
    phone_number: '',
    website: '',
  });
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchool = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching school data:', error);
      } else if (data) {
        setSchool({
            name: data.name || '',
            address: data.address || '',
            logo_url: data.logo_url || '',
            latitude: data.latitude?.toString() || '',
            longitude: data.longitude?.toString() || '',
            phone_number: data.phone_number || '',
            website: data.website || '',
        });
      }
      setLoading(false);
    };

    fetchSchool();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSchool((prevSchool) => ({
      ...prevSchool,
      [id]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let newLogoUrl = school.logo_url;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        // Using a unique file name, so upsert is not strictly necessary
        // but doesn't hurt. Let's keep the original intention of replacing.
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('school-logos')
          .upload(fileName, logoFile, { upsert: true });

        if (uploadError) {
          throw new Error('Gagal mengupload logo: ' + uploadError.message);
        }

        if (!uploadData) {
            throw new Error('Gagal mengupload logo, data tidak ditemukan setelah upload.');
        }
        
        const { data: urlData } = supabase.storage
          .from('school-logos')
          .getPublicUrl(uploadData.path);
        
        newLogoUrl = urlData.publicUrl;
      }

      const updateData = {
          name: school.name,
          address: school.address,
          phone_number: school.phone_number,
          website: school.website,
          latitude: school.latitude === '' ? null : parseFloat(school.latitude),
          longitude: school.longitude === '' ? null : parseFloat(school.longitude),
          logo_url: newLogoUrl,
      };

      const { error } = await supabase
        .from('schools')
        .update(updateData)
        .eq('id', 1);

      if (error) {
        throw new Error('Gagal menyimpan data: ' + error.message);
      } else {
        alert('Informasi sekolah berhasil disimpan!');
        setSchool(prev => ({...prev, logo_url: newLogoUrl}));
        setLogoFile(null);
        navigate('/dashboard');
      }
    } catch (error: any) {
        alert(error.message || 'Terjadi kesalahan');
    } finally {
        setLoading(false);
    }
  };
  
  if (loading && !school.name) {
    return (
        <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <>
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Dashboard
      </Link>
      <Card className="w-full max-w-4xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Edit Informasi Sekolah</CardTitle>
            <CardDescription>
              Perbarui informasi detail tentang sekolah di sini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Sekolah</Label>
                <Input id="name" value={school.name} onChange={handleChange} placeholder="Contoh: SMA Negeri 1 Model" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" value={school.address} onChange={handleChange} placeholder="Contoh: Jl. Pendidikan No. 1" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="logo">Logo Sekolah</Label>
                <div className="flex items-center gap-4">
                    {school.logo_url && !logoFile && (
                        <img src={`${school.logo_url}?t=${new Date().getTime()}`} alt="Logo" className="h-20 w-20 object-contain rounded-md border border-gray-200" />
                    )}
                    {logoFile && (
                        <img src={URL.createObjectURL(logoFile)} alt="Preview Logo" className="h-20 w-20 object-contain rounded-md border border-gray-200" />
                    )}
                    <Input id="logo" type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/svg+xml" className="max-w-xs" />
                </div>
                <p className="text-sm text-gray-500">Upload logo baru untuk mengganti yang lama. Format: PNG, JPG, SVG.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input id="latitude" type="number" step="any" value={school.latitude} onChange={handleChange} placeholder="-6.200000" />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input id="longitude" type="number" step="any" value={school.longitude} onChange={handleChange} placeholder="106.816666" />
                  </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone_number">Nomor Telepon</Label>
                <Input id="phone_number" value={school.phone_number} onChange={handleChange} placeholder="Contoh: 021-1234567" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={school.website} onChange={handleChange} placeholder="https://www.sman1model.sch.id" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Informasi'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}