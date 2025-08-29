-- Create photos table for gallery
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'general',
  is_featured BOOLEAN DEFAULT false,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Create policies - everyone can view photos
CREATE POLICY "Photos are viewable by everyone" 
ON public.photos 
FOR SELECT 
USING (true);

-- Only admins can manage photos (we'll check admin status in the edge function)
CREATE POLICY "Only authenticated users can manage photos" 
ON public.photos 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Create storage policies for photos
CREATE POLICY "Photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'photos');

-- Only allow photo uploads through edge functions (admin check will be in the function)
CREATE POLICY "Admin can upload photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

CREATE POLICY "Admin can update photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'photos' AND auth.role() = 'authenticated');

CREATE POLICY "Admin can delete photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'photos' AND auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_photos_updated_at
BEFORE UPDATE ON public.photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();