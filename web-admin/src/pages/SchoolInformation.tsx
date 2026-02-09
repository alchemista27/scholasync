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

export function SchoolInformation() {
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
            latitude: data.latitude || '',
            longitude: data.longitude || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('schools').upsert({ id: 1, ...school });

    if (error) {
      alert('Gagal menyimpan data: ' + error.message);
    } else {
      alert('Informasi sekolah berhasil disimpan!');
    }
    setLoading(false);
  };
  
  if (loading && !school.name) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informasi Sekolah</CardTitle>
            <CardDescription>
              Masukkan atau perbarui informasi detail tentang sekolah.
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
                <Label htmlFor="logo_url">URL Logo</Label>
                <Input id="logo_url" value={school.logo_url} onChange={handleChange} placeholder="https://example.com/logo.png" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input id="latitude" type="number" value={school.latitude} onChange={handleChange} placeholder="-6.200000" />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input id="longitude" type="number" value={school.longitude} onChange={handleChange} placeholder="106.816666" />
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
    </div>
  );
}
