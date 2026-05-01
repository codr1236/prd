-- Drop old table if exists
drop table if exists architectures;

-- Create table with user_id for per-user data isolation
create table architectures (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  prd_data jsonb not null
);

-- Enable Row Level Security
alter table architectures enable row level security;

-- Policy: users can only see their own rows
create policy "Users can view own architectures"
  on architectures for select
  using (auth.uid() = user_id);

-- Policy: users can insert their own rows
create policy "Users can insert own architectures"
  on architectures for insert
  with check (auth.uid() = user_id);

-- Policy: users can delete their own rows
create policy "Users can delete own architectures"
  on architectures for delete
  using (auth.uid() = user_id);
