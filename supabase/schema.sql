create schema if not exists "rae-taxi";

create table "rae-taxi".vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  make text not null,
  model text not null,
  year integer not null,
  seats integer not null,
  description text,
  image_url text,
  daily_rate decimal(10,2) not null,
  color text,
  plate text,
  available boolean default true,
  created_at timestamptz default now()
);

create table "rae-taxi".insurance_options (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_per_day decimal(10,2) not null default 0,
  sort_order integer default 0
);

create table "rae-taxi".bookings (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references "rae-taxi".vehicles(id),
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  license_number text,
  license_country text,
  pickup_date date not null,
  dropoff_date date not null,
  insurance_option_id uuid references "rae-taxi".insurance_options(id),
  status text default 'pending',
  total_amount decimal(10,2),
  notes text,
  created_at timestamptz default now()
);

create table "rae-taxi".blocked_dates (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references "rae-taxi".vehicles(id),
  date date not null,
  reason text,
  created_at timestamptz default now()
);

create table "rae-taxi".taxi_routes (
  id uuid primary key default gen_random_uuid(),
  from_location text not null,
  to_location text not null,
  price_usd decimal(10,2) not null,
  sort_order integer default 0,
  active boolean default true
);

create table "rae-taxi".taxi_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  pickup_location text not null,
  dropoff_location text not null,
  pickup_datetime timestamptz,
  passengers integer default 1,
  price_quoted decimal(10,2),
  status text default 'pending',
  notes text,
  created_at timestamptz default now()
);

-- Seed data
insert into "rae-taxi".vehicles (name, make, model, year, seats, daily_rate, description) values
  ('RAV4', 'Toyota', 'RAV4', 2013, 5, 75.00, 'Comfortable SUV perfect for exploring the island. Air-conditioned with ample boot space.'),
  ('Voxy', 'Toyota', 'Voxy', 2025, 8, 110.00, 'Brand new spacious minivan ideal for groups and families. Features modern amenities.'),
  ('Fit', 'Honda', 'Fit', 2018, 4, 55.00, 'Economical and easy to drive. Great fuel efficiency for getting around Antigua.');

create table "rae-taxi".contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  created_at timestamptz default now()
);

insert into "rae-taxi".insurance_options (name, description, price_per_day, sort_order) values
  ('None', 'No additional insurance. Driver assumes full liability.', 0.00, 0),
  ('Basic CDW', 'Collision Damage Waiver — reduces your liability in case of an accident.', 15.00, 1),
  ('Full Cover', 'Full protection including CDW, theft protection, and third-party liability.', 25.00, 2);

insert into "rae-taxi".taxi_routes (from_location, to_location, price_usd, sort_order) values
  ('V.C. Bird International Airport', 'Jolly Beach', 50.00, 1),
  ('V.C. Bird International Airport', 'English Harbour', 75.00, 2);
