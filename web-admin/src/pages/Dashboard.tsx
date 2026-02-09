import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { role, loading } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl">Welcome to the Dashboard!</h1>
      <div className="mt-4 flex gap-4">
        <Button onClick={handleSignOut}>Sign Out</Button>
        {!loading && role === 'admin' && (
          <Link to="/school-information">
            <Button variant="outline">Informasi Sekolah</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
