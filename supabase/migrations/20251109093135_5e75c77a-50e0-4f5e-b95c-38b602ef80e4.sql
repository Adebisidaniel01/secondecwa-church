-- Add channel_url field to youtube_settings
ALTER TABLE youtube_settings
ADD COLUMN IF NOT EXISTS channel_url text;

-- Update existing record to have a default channel_url
UPDATE youtube_settings
SET channel_url = 'https://www.youtube.com/@your-channel'
WHERE channel_url IS NULL;