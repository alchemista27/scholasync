CREATE TABLE employees (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    full_name TEXT NOT NULL,
    nipy TEXT,
    birthplace TEXT,
    birthdate DATE,
    email TEXT UNIQUE,
    whatsapp_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE schools (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    address TEXT,
    logo_url TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    phone_number TEXT,
    website TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
