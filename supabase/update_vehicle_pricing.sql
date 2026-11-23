-- Update pricing for Honda CR-V and Toyota Voxy 2009
-- Run this in the Supabase SQL editor

update "rae-taxi".vehicles set daily_rate = 75.00 where make = 'Honda' and model = 'CR-V' and year = 2014;
update "rae-taxi".vehicles set daily_rate = 90.00 where make = 'Toyota' and model = 'Voxy' and year = 2009;
