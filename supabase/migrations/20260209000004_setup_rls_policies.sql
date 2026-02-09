-- Enable RLS for the tables we created and add basic read policies.
-- These are permissive policies to get started. You should refine them
-- to be more restrictive based on your application's needs.

-- 1. Policies for 'employees' table
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all employees"
ON public.employees
FOR SELECT
TO authenticated
USING (true);

-- 2. Policies for 'schools' table
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all users to read schools"
ON public.schools
FOR SELECT
TO anon, authenticated -- School info is often public
USING (true);

-- 3. Policies for 'roles' table
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all roles"
ON public.roles
FOR SELECT
TO authenticated
USING (true);

-- 4. Policies for 'user_roles' table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all user_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);
