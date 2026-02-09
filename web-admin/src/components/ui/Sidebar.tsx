import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Home, School, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full w-64 bg-gray-800 text-white">
      <div className="p-4 mb-4">
        <h2 className="text-2xl font-bold">ScholaSync</h2>
      </div>
      <nav className="flex-grow">
        <Link to="/dashboard" className="flex items-center p-4 hover:bg-gray-700">
          <School className="mr-3" />
          Informasi Sekolah
        </Link>
      </nav>
      <div className="p-4">
        <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start">
          <LogOut className="mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
