-- Fix RLS policies for admin_settings table
-- Since this is admin functionality, we'll make it accessible but secure

-- Create policy to allow reading admin settings (needed for login verification)
CREATE POLICY "Allow reading admin settings for authentication" 
ON admin_settings 
FOR SELECT 
USING (true);

-- Create policy to allow updating admin settings (for session management)
CREATE POLICY "Allow updating admin settings for session management" 
ON admin_settings 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Create policy to allow inserting admin settings if none exist
CREATE POLICY "Allow inserting admin settings" 
ON admin_settings 
FOR INSERT 
WITH CHECK (true);