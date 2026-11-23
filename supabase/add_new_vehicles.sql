-- Add 2014 Honda CR-V and 2009 Toyota Voxy to the fleet
-- Run this in the Supabase SQL editor

insert into "rae-taxi".vehicles (name, make, model, year, seats, daily_rate, description, image_url, color, available) values
  ('CR-V', 'Honda', 'CR-V', 2014, 5, 70.00,
   'Reliable compact SUV, ideal for couples or small families exploring Antigua. Comfortable ride with air conditioning and good fuel efficiency.',
   '/vehicles/honda-crv.png', 'White', true),
  ('Voxy 2009', 'Toyota', 'Voxy', 2009, 8, 80.00,
   'Spacious 8-seater minivan perfect for groups and families. Great value for multi-day island adventures with plenty of room for luggage.',
   '/vehicles/toyota-voxy.png', 'White', true);
