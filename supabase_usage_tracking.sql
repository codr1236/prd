-- Table to track generation usage for rate limiting
create table if not exists user_usage (
  user_id uuid references auth.users(id) on delete cascade primary key,
  last_generation timestamp with time zone,
  generation_count_today int default 0,
  last_reset_date date default current_date
);

-- Enable RLS
alter table user_usage enable row level security;

-- Users can only see and update their own usage
create policy "Users can view own usage"
  on user_usage for select
  using (auth.uid() = user_id);

create policy "Users can update own usage"
  on user_usage for update
  using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on user_usage for insert
  with check (auth.uid() = user_id);

-- Function to check and increment usage
create or replace function check_and_increment_usage(user_id_input uuid, max_per_day int)
returns boolean
language plpgsql
security definer
as $$
declare
  current_usage int;
  last_reset date;
begin
  -- Get current usage
  select generation_count_today, last_reset_date into current_usage, last_reset
  from user_usage where user_id = user_id_input;

  -- If no record, create one
  if not found then
    insert into user_usage (user_id, generation_count_today, last_reset_date, last_generation)
    values (user_id_input, 1, current_date, now());
    return true;
  end if;

  -- If it's a new day, reset count
  if last_reset < current_date then
    update user_usage
    set generation_count_today = 1,
        last_reset_date = current_date,
        last_generation = now()
    where user_id = user_id_input;
    return true;
  end if;

  -- Check if limit reached
  if current_usage >= max_per_day then
    return false;
  end if;

  -- Increment count
  update user_usage
  set generation_count_today = current_usage + 1,
      last_generation = now()
  where user_id = user_id_input;
  
  return true;
end;
$$;
