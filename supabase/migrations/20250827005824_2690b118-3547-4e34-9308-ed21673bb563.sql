-- Create comprehensive backend for church website

-- Contact form submissions
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded'))
);

-- Prayer requests
CREATE TABLE public.prayer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  request TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT false,
  is_confidential BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'answered', 'ongoing')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sermons management
CREATE TABLE public.sermons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  date DATE NOT NULL,
  series TEXT,
  scripture TEXT,
  duration INTEGER, -- in minutes
  description TEXT,
  audio_url TEXT,
  video_url TEXT,
  transcript TEXT,
  notes TEXT,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Events management
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  capacity INTEGER,
  registration_required BOOLEAN DEFAULT false,
  registration_deadline DATE,
  cost DECIMAL(10,2) DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event registrations
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  special_needs TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  attendance_status TEXT DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'no-show', 'cancelled'))
);

-- Ministries management
CREATE TABLE public.ministries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  leader_name TEXT,
  leader_email TEXT,
  leader_phone TEXT,
  meeting_time TEXT,
  meeting_location TEXT,
  age_group TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  volunteer_positions_available INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ministry activities
CREATE TABLE public.ministry_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ministry_id UUID NOT NULL REFERENCES public.ministries(id) ON DELETE CASCADE,
  activity_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ministry volunteers
CREATE TABLE public.ministry_volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ministry_id UUID NOT NULL REFERENCES public.ministries(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  emergency_contact TEXT,
  emergency_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Newsletter subscriptions
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  subscription_type TEXT DEFAULT 'weekly' CHECK (subscription_type IN ('weekly', 'monthly', 'events')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Donations/Giving
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT,
  donor_email TEXT,
  amount DECIMAL(10,2) NOT NULL,
  donation_type TEXT DEFAULT 'tithe' CHECK (donation_type IN ('tithe', 'offering', 'mission', 'building', 'special')),
  payment_method TEXT DEFAULT 'online' CHECK (payment_method IN ('online', 'cash', 'check', 'bank_transfer')),
  is_anonymous BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  dedication TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Announcements/News
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'urgent', 'event', 'ministry', 'worship')),
  is_published BOOLEAN DEFAULT false,
  publish_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Church members (for admin management)
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  membership_date DATE DEFAULT CURRENT_DATE,
  membership_status TEXT DEFAULT 'active' CHECK (membership_status IN ('active', 'inactive', 'visitor', 'transferred')),
  baptism_date DATE,
  confirmation_date DATE,
  family_id UUID, -- for linking family members
  emergency_contact TEXT,
  emergency_phone TEXT,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Public access policies (for website visitors)
CREATE POLICY "Anyone can view sermons" ON public.sermons FOR SELECT USING (true);
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can view ministries" ON public.ministries FOR SELECT USING (true);
CREATE POLICY "Anyone can view ministry activities" ON public.ministry_activities FOR SELECT USING (true);
CREATE POLICY "Anyone can view published announcements" ON public.announcements FOR SELECT USING (is_published = true AND (expiry_date IS NULL OR expiry_date >= CURRENT_DATE));

-- Allow public submissions
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit prayer requests" ON public.prayer_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can register for events" ON public.event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can volunteer for ministry" ON public.ministry_volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can make donations" ON public.donations FOR INSERT WITH CHECK (true);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prayer_requests_updated_at
  BEFORE UPDATE ON public.prayer_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sermons_updated_at
  BEFORE UPDATE ON public.sermons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ministries_updated_at
  BEFORE UPDATE ON public.ministries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ministry_volunteers_updated_at
  BEFORE UPDATE ON public.ministry_volunteers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON public.newsletter_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_events_date ON public.events(date);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_sermons_date ON public.sermons(date);
CREATE INDEX idx_sermons_speaker ON public.sermons(speaker);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at);
CREATE INDEX idx_prayer_requests_status ON public.prayer_requests(status);
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_ministry_volunteers_ministry_id ON public.ministry_volunteers(ministry_id);
CREATE INDEX idx_donations_created_at ON public.donations(created_at);
CREATE INDEX idx_announcements_publish_date ON public.announcements(publish_date);

-- Insert sample data for demonstration
INSERT INTO public.sermons (title, speaker, date, series, scripture, duration, description, is_featured) VALUES
('Walking in Faith, Not Fear', 'Pastor Samuel Oyegunle', '2025-05-15', 'Faith Over Fear', 'Isaiah 41:10', 32, 'Discover how faith can overcome our deepest fears and uncertainties. Learn to trust in God''s perfect plan for your life.', true),
('The Power of Community', 'Pastor Samuel Oyegunle', '2024-12-08', 'Together We Rise', 'Hebrews 10:24-25', 28, 'Exploring the importance of Christian fellowship and how we can support one another in faith.', false),
('Hope in Hard Times', 'Pastor Malik Emmanuel', '2025-02-01', 'Faith Over Fear', 'Romans 15:13', 35, 'Finding hope and strength when facing life''s most difficult challenges through God''s promises.', false),
('Parents relation with their children', 'Guest Speaker: Mr. Aderemi-Babatunde', '2025-04-24', 'Heart of Love', '1 Corinthians 13:4-7', 30, 'Understanding the depth and breadth of Parents love and how we can reflect it to the behaviour of their children.', false),
('Serving with Joy', 'Reverend Ayebulu Emmanuel', '2025-01-17', 'Together We Rise', 'Galatians 5:13', 26, 'Discovering the joy that comes from serving others and making a difference in our community.', false),
('Prayers That Move Mountains', 'Reverend Emmanuel Ayebulu', '2025-06-10', 'Faith Over Fear', 'Matthew 17:20', 33, 'Learning to pray with faith and confidence, knowing that God hears and answers our prayers.', false);

INSERT INTO public.events (title, description, date, start_time, end_time, location, category, capacity, registration_required, is_featured) VALUES
('Christmas Eve Candlelight Service', 'Join us for a beautiful candlelight service as we celebrate the birth of our Savior. This intimate worship experience includes carols, scripture readings, and the lighting of candles.', '2025-12-24', '19:00', '21:00', 'Main Sanctuary', 'Special Service', 300, true, true),
('New Year Prayer & Fasting', 'Start the new year with prayer and fasting. Join us for a day of seeking God''s guidance and blessing for the year ahead.', '2026-01-01', '06:00', '18:00', 'Main Church', 'Prayer', 50, true, false),
('DAMUTEENS 20''S', 'A weekend of fun, fellowship, and spiritual growth for our youth. Activities include worship, games, workshops, and outdoor adventures.', '2025-01-15', '18:00', '15:00', 'Main Auditorium', 'Youth', 40, true, false),
('Couples fellowship programme', 'Strengthen your marriage with practical tools and biblical principles. Includes lunch and childcare.', '2025-01-25', '09:00', '16:00', 'Main Church', 'Workshop', 30, true, false),
('BOB and JOB', 'Help us serve our community by helping in house chores and community cleaning.', '2025-02-01', '10:00', '14:00', 'Church Parking Lot', 'Outreach', null, false, false),
('Weekly Fellowship', 'Celebrate in the presence of the Lord. Enjoy great music, prayer sessions, and fellowship with other members.', '2025-02-14', '18:00', '21:00', 'Fellowship Hall', 'Fellowship', 60, false, false);

INSERT INTO public.ministries (name, description, leader_name, leader_email, meeting_time, meeting_location, age_group, category, is_featured) VALUES
('Youth Ministry', 'Empowering teenagers to discover their identity in Christ through fun activities, deep conversations, and meaningful service opportunities.', 'Pastor Alabi Malik', 'ecwa2ilorin@yahoo.com', 'Fridays 6:30 PM', 'Teenagers Chapel', 'Ages 13-18', 'Youth', true),
('Children''s Ministry', 'Creating a safe and fun environment where children can learn about God''s love through age-appropriate lessons, crafts, and activities.', 'Miss Damilola, Mr. Gbenga', 'ecwa2ilorin@yahoo.com', 'Sundays during service', 'Children''s Section', 'Ages 3-12', 'Children', false),
('Worship Ministry', 'Leading our congregation in heartfelt worship through music, vocals, and technical support, creating an atmosphere for encountering God.', 'SEES Choir', 'ecwa2ilorin@yahoo.com', 'Sundays & Wednesdays', 'Main Sanctuary', 'All Ages', 'Worship', false),
('Community Outreach', 'Serving our local community with compassion and practical assistance, demonstrating God''s love through action and service.', 'Second ECWA youths', 'ecwa2ilorin@yahoo.com', 'Various', 'Community', 'All Ages', 'Outreach', false),
('Women''s Ministry', 'Building strong friendships and spiritual connections among women through Bible study, fellowship events, and service projects.', 'Women fellowship committee', 'ecwa2ilorin@yahoo.com', 'Monday 5:00 PM', 'Main Church', 'Women 18+', 'Fellowship', false),
('Men''s Ministry', 'Encouraging men to grow in their faith, build meaningful relationships, and become strong spiritual leaders in their families and community.', 'Men''s fellowship committee', 'ecwa2@yahoo.com', 'Monday 5:00PM', 'Main Church', 'Men 18+', 'Fellowship', false),
('Prison Ministry', 'Creating a welcoming atmosphere for all who enter our church doors, ensuring everyone feels valued and cared for.', 'Prison Outreach team', 'ecwa2ilorin@yahoo.com', 'As needed', 'Various', 'All Ages', 'Outreach', false);

INSERT INTO public.ministry_activities (ministry_id, activity_name) VALUES
((SELECT id FROM public.ministries WHERE name = 'Youth Ministry'), 'Youth Group'),
((SELECT id FROM public.ministries WHERE name = 'Youth Ministry'), 'IDYC Camp'),
((SELECT id FROM public.ministries WHERE name = 'Youth Ministry'), 'Mission Trips'),
((SELECT id FROM public.ministries WHERE name = 'Youth Ministry'), 'Games'),
((SELECT id FROM public.ministries WHERE name = 'Children''s Ministry'), 'Sunday School'),
((SELECT id FROM public.ministries WHERE name = 'Children''s Ministry'), 'Children''s Choir'),
((SELECT id FROM public.ministries WHERE name = 'Worship Ministry'), 'Choir'),
((SELECT id FROM public.ministries WHERE name = 'Worship Ministry'), 'Praise Band'),
((SELECT id FROM public.ministries WHERE name = 'Worship Ministry'), 'Sound Team'),
((SELECT id FROM public.ministries WHERE name = 'Worship Ministry'), 'Media Team'),
((SELECT id FROM public.ministries WHERE name = 'Community Outreach'), 'Homeless Ministry'),
((SELECT id FROM public.ministries WHERE name = 'Community Outreach'), 'Prison Ministry'),
((SELECT id FROM public.ministries WHERE name = 'Community Outreach'), 'Senior Care'),
((SELECT id FROM public.ministries WHERE name = 'Women''s Ministry'), 'Bible Study'),
((SELECT id FROM public.ministries WHERE name = 'Women''s Ministry'), 'Retreats'),
((SELECT id FROM public.ministries WHERE name = 'Women''s Ministry'), 'Service Projects'),
((SELECT id FROM public.ministries WHERE name = 'Women''s Ministry'), 'Fellowship'),
((SELECT id FROM public.ministries WHERE name = 'Men''s Ministry'), 'Bible Study'),
((SELECT id FROM public.ministries WHERE name = 'Men''s Ministry'), 'Men''s Breakfast'),
((SELECT id FROM public.ministries WHERE name = 'Men''s Ministry'), 'Service Projects'),
((SELECT id FROM public.ministries WHERE name = 'Men''s Ministry'), 'Sports'),
((SELECT id FROM public.ministries WHERE name = 'Prison Ministry'), 'Greeters'),
((SELECT id FROM public.ministries WHERE name = 'Prison Ministry'), 'Gospel Ministry'),
((SELECT id FROM public.ministries WHERE name = 'Prison Ministry'), 'Event Catering'),
((SELECT id FROM public.ministries WHERE name = 'Prison Ministry'), 'Worship Team');

INSERT INTO public.announcements (title, content, category, is_published, publish_date, priority) VALUES
('Welcome to Second ECWA Church', 'We are so glad you''re here! Whether this is your first visit or you''ve been part of our family for years, we want you to know that you belong here. If you''re new, please stop by our welcome center after service to learn more about our church and pick up a welcome gift.', 'general', true, CURRENT_DATE, 1),
('Christmas Service Schedule', 'Join us for our special Christmas services! Christmas Eve Candlelight Service at 7:00 PM and 11:00 PM. Christmas Day service at 10:00 AM. Invite your family and friends to celebrate the birth of our Savior with us.', 'event', true, CURRENT_DATE, 2),
('Youth Ministry Registration Open', 'Registration is now open for our Youth Ministry programs. Ages 13-18 welcome every Friday at 6:30 PM in the Teenagers Chapel. Contact Pastor Alabi Malik for more information.', 'ministry', true, CURRENT_DATE, 1);