import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LiveStreamIndicator = () => {
  const [isLive, setIsLive] = useState(false);
  const [channelUrl, setChannelUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch YouTube settings
    const fetchYouTubeSettings = async () => {
      const { data } = await supabase
        .from('youtube_settings')
        .select('*')
        .limit(1)
        .single();

      if (data) {
        setIsLive(data.is_live || false);
        setChannelUrl(data.channel_url);
      }
    };

    fetchYouTubeSettings();

    // Set up real-time subscription to youtube_settings
    const channel = supabase
      .channel('youtube-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'youtube_settings'
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'is_live' in payload.new) {
            setIsLive(payload.new.is_live || false);
            setChannelUrl(payload.new.channel_url || null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!isLive) return null;

  return (
    <a 
      href={channelUrl || 'https://www.youtube.com'}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-pulse smooth-transition"
    >
      <Radio className="w-5 h-5 animate-pulse" />
      <span className="font-semibold">
        <span className="hidden sm:inline">We're Live Now! </span>
        <span className="sm:hidden">Live</span>
      </span>
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
    </a>
  );
};

export default LiveStreamIndicator;
