create table architectures (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  prd_data jsonb not null
);

-- Disable Row Level Security (RLS) for public access
alter table architectures disable row level security;
