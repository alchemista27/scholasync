CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  admin_email TEXT := 'admin@scholasync.test'; -- You can change this email
  admin_password TEXT := 'admin123'; -- You can change this password
  new_user_id UUID;
  admin_role_id INT;
BEGIN
  -- First, check if the admin user already exists in auth.users
  SELECT id INTO new_user_id FROM auth.users WHERE email = admin_email;

  -- If the user does not exist, create them
  IF new_user_id IS NULL THEN
    -- Insert into auth.users and get the new user's ID
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES
      ('00000000-0000-0000-0000-000000000000', extensions.gen_random_uuid(), 'authenticated', 'authenticated', admin_email, extensions.crypt(admin_password, extensions.gen_salt('bf')), NOW(), NULL, NULL, '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW())
    RETURNING id INTO new_user_id;

    -- Now, insert into the employees table
    INSERT INTO public.employees (id, full_name, email)
    VALUES (new_user_id, 'Admin User', admin_email);
  END IF;

  -- Get the 'admin' role ID
  SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';

  -- Finally, assign the 'admin' role to the user in user_roles, making sure not to create duplicates
  IF admin_role_id IS NOT NULL AND new_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (new_user_id, admin_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;

END $$;
