import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Make sure to have a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function signUpNewUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@sditiqra2bengkulu.sch.id',
    password: 'Admin123',
  });

  if (error) {
    console.error('Error signing up:', error.message);
  } else {
    console.log('User signed up successfully:', data);
  }
}

signUpNewUser();
