import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Youtube, ExternalLink } from "lucide-react";

interface YouTubeSettings {
  channel_name: string;
  is_live: boolean;
}

const YouTubeLive = () => {
  const [youtubeSettings, setYoutubeSettings] = useState<YouTubeSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchYouTubeStatus();
    
    // Set up real-time updates
    const channel = supabase
      .channel('youtube-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'youtube_settings'
        },
        () => {
          fetchYouTubeStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchYouTubeStatus = async () => {
    try {
      const { data } = await supabase.functions.invoke('youtube-integration', {
        body: { action: 'status' }
      });

      if (data.settings) {
        setYoutubeSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch YouTube status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!youtubeSettings) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          Live Stream
        </CardTitle>
        <CardDescription>
          {youtubeSettings.channel_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={youtubeSettings.is_live ? "destructive" : "secondary"}>
            {youtubeSettings.is_live ? "🔴 LIVE NOW" : "⚫ OFFLINE"}
          </Badge>
        </div>
        
        {youtubeSettings.is_live ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              We're currently live! Join us for worship and fellowship.
            </p>
            <Button className="w-full" asChild>
              <a 
                href={`https://youtube.com/channel/${youtubeSettings.channel_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Watch Live on YouTube
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              We're not currently live, but you can still visit our YouTube channel for past services and content.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <a 
                href={`https://youtube.com/channel/${youtubeSettings.channel_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Youtube className="h-4 w-4" />
                Visit Our Channel
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default YouTubeLive;