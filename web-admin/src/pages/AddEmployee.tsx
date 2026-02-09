import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function AddEmployee() {
  const [fullName, setFullName] = useState('');
  const [nipy, setNipy] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.from('employees').insert({
      full_name: fullName,
      nipy,
      birthplace,
      birthdate,
      email,
      whatsapp_number: whatsappNumber,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard/employees');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Guru atau Karyawan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nipy">NIPY</Label>
            <Input
              id="nipy"
              value={nipy}
              onChange={(e) => setNipy(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthplace">Tempat Lahir</Label>
            <Input
              id="birthplace"
              value={birthplace}
              onChange={(e) => setBirthplace(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthdate">Tanggal Lahir</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">Nomor WhatsApp</Label>
            <Input
              id="whatsappNumber"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
