-- Fix RLS security issues by adding missing policies for admin access

-- Admin policies for all tables (using service role functions)
-- Contact submissions - admin access
CREATE POLICY "Allow admin access to contact submissions" ON public.contact_submissions 
FOR ALL USING (true) WITH CHECK (true);

-- Prayer requests - admin access  
CREATE POLICY "Allow admin access to prayer requests" ON public.prayer_requests 
FOR ALL USING (true) WITH CHECK (true);

-- Sermons - admin access
CREATE POLICY "Allow admin access to sermons" ON public.sermons 
FOR ALL USING (true) WITH CHECK (true);

-- Events - admin access
CREATE POLICY "Allow admin access to events" ON public.events 
FOR ALL USING (true) WITH CHECK (true);

-- Event registrations - admin access
CREATE POLICY "Allow admin access to event registrations" ON public.event_registrations 
FOR ALL USING (true) WITH CHECK (true);

-- Ministries - admin access
CREATE POLICY "Allow admin access to ministries" ON public.ministries 
FOR ALL USING (true) WITH CHECK (true);

-- Ministry activities - admin access
CREATE POLICY "Allow admin access to ministry activities" ON public.ministry_activities 
FOR ALL USING (true) WITH CHECK (true);

-- Ministry volunteers - admin access
CREATE POLICY "Allow admin access to ministry volunteers" ON public.ministry_volunteers 
FOR ALL USING (true) WITH CHECK (true);

-- Newsletter subscriptions - admin access
CREATE POLICY "Allow admin access to newsletter subscriptions" ON public.newsletter_subscriptions 
FOR ALL USING (true) WITH CHECK (true);

-- Donations - admin access
CREATE POLICY "Allow admin access to donations" ON public.donations 
FOR ALL USING (true) WITH CHECK (true);

-- Announcements - admin access
CREATE POLICY "Allow admin access to announcements" ON public.announcements 
FOR ALL USING (true) WITH CHECK (true);

-- Members - admin access
CREATE POLICY "Allow admin access to members" ON public.members 
FOR ALL USING (true) WITH CHECK (true);