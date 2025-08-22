-- Create table for YouTube integration settings
CREATE TABLE public.youtube_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key TEXT,
  channel_id TEXT,
  channel_name TEXT,
  is_live BOOLEAN DEFAULT FALSE,
  live_stream_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for uploaded videos
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  file_size BIGINT, -- in bytes
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for developer admin settings
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  password_hash TEXT NOT NULL,
  session_token TEXT,
  session_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.youtube_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to videos and YouTube settings
CREATE POLICY "Videos are viewable by everyone" 
ON public.videos 
FOR SELECT 
USING (true);

CREATE POLICY "YouTube settings are viewable by everyone" 
ON public.youtube_settings 
FOR SELECT 
USING (true);

-- Admin settings are completely private (no public access policies)

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Create policies for video uploads (will be handled by admin functions)
CREATE POLICY "Videos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'videos');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_youtube_settings_updated_at
BEFORE UPDATE ON public.youtube_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();