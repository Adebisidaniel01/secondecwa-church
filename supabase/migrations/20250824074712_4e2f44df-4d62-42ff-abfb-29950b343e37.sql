-- Set admin password to ECWA_123
-- First, delete any existing admin settings
DELETE FROM admin_settings;

-- Insert new admin settings with hashed password
-- Using md5 for simplicity (in production, use bcrypt or similar)
INSERT INTO admin_settings (password_hash) 
VALUES (md5('ECWA_123'));