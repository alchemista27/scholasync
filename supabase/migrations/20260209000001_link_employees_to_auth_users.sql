-- Drop the existing primary key constraint and the 'id' column, as it's a BIGINT and we need a UUID.
ALTER TABLE public.employees DROP CONSTRAINT employees_pkey;
ALTER TABLE public.employees DROP COLUMN id;

-- Add a new 'id' column that is a UUID and references the 'auth.users' table.
-- This creates a one-to-one relationship where the employee's ID is the same as their authentication user ID.
ALTER TABLE public.employees
ADD COLUMN id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE;
