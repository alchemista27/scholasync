-- Create a table to store the available roles
CREATE TABLE public.roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Create a junction table to link users to roles
CREATE TABLE public.user_roles (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Add some initial roles to the roles table.
-- You can add or change these as needed.
INSERT INTO public.roles (name) VALUES
('admin'),
('teacher'),
('staff'),
('parent');
