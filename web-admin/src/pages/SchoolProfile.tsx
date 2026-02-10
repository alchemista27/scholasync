import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';

interface School {
    name: string;
    address: string | null;
    logo_url: string | null;
    latitude: number | null;
    longitude: number | null;
    phone_number: string | null;
    website: string | null;
}

export function SchoolProfile() {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  useEffect(() => {
    const fetchSchool = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('*')
          .eq('id', 1)
          .single();

        // Ignore "no rows found" (PGRST116) and "NOT_FOUND" (404) errors
        if (error && error.code !== 'PGRST116' && error.code !== 'NOT_FOUND') {
          console.error('Error fetching school data:', error);
        } else if (data) {
          setSchool(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching school data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center">
            <p>Loading school information...</p>
        </div>
    );
  }

  if (!school) {
    return (
        <div>
            <h2 className="text-xl font-semibold">No School Information Found</h2>
            <p className="mb-4">There is no school information available yet.</p>
            {role === 'admin' && (
                <Link to="/dashboard/edit-school">
                    <Button>Add School Information</Button>
                </Link>
            )}
        </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>{school.name}</CardTitle>
            <CardDescription>Detail informasi sekolah.</CardDescription>
        </div>
        {role === 'admin' && (
            <Link to="/dashboard/edit-school">
                <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </Link>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
            {school.logo_url && <img src={school.logo_url} alt="School Logo" className="w-32 h-32 object-contain rounded-md mb-4" />}
            <div className="grid gap-1">
                <p className="text-sm font-medium text-gray-500">Alamat</p>
                <p>{school.address || '-'}</p>
            </div>
            <div className="grid gap-1">
                <p className="text-sm font-medium text-gray-500">Telepon</p>
                <p>{school.phone_number || '-'}</p>
            </div>
            <div className="grid gap-1">
                <p className="text-sm font-medium text-gray-500">Website</p>
                <a href={school.website || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{school.website || '-'}</a>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                    <p className="text-sm font-medium text-gray-500">Latitude</p>
                    <p>{school.latitude ?? '-'}</p>
                </div>
                <div className="grid gap-1">
                    <p className="text-sm font-medium text-gray-500">Longitude</p>
                    <p>{school.longitude ?? '-'}</p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
