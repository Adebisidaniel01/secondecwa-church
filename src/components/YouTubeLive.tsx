import { Youtube, ExternalLink, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const YouTubeLive = () => {
  const [isLive, setIsLive] = useState(false);
  const [channelId, setChannelId] = useState<string>("");
  const channelName = "Second ECWA Church, Ilorin";
  const liveDashboardUrl = `https://studio.youtube.com/channel/${channelId}/livestreaming`;

  useEffect(() => {
    const fetchYouTubeSettings = async () => {
      const { data } = await supabase
        .from('youtube_settings')
        .select('*')
        .limit(1)
        .single();

      if (data) {
        setIsLive(data.is_live || false);
        setChannelId(data.channel_id || "UCFM8ROf93C7j_D6MDL0h42Q");
      }
    };

    fetchYouTubeSettings();

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
            setChannelId(payload.new.channel_id || "UCFM8ROf93C7j_D6MDL0h42Q");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          YouTube Live Stream
        </CardTitle>
        <CardDescription>{channelName}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Live Status Badge */}
        <div className="flex items-center gap-2">
          {isLive ? (
            <Badge variant="destructive" className="flex items-center gap-2 animate-pulse">
              <Radio className="h-3 w-3" />
              🔴 LIVE NOW
            </Badge>
          ) : (
            <Badge variant="secondary">Offline</Badge>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-muted/50 rounded-lg p-6 text-center space-y-4">
          <Youtube className="h-16 w-16 mx-auto text-red-600" />
          <div>
            <h3 className="text-xl font-semibold mb-2">
              {isLive ? "We're Live on YouTube!" : "Watch Our Live Streams"}
            </h3>
            <p className="text-muted-foreground">
              {isLive 
                ? "Join us now for live worship and teaching on our YouTube channel."
                : "Subscribe to our YouTube channel to get notified when we go live."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isLive && (
            <Button size="lg" className="flex items-center gap-2" asChild>
              <a
                href={`https://www.youtube.com/channel/${channelId}/live`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Radio className="h-4 w-4" />
                Watch Live Now
              </a>
            </Button>
          )}

          <Button 
            variant={isLive ? "outline" : "default"} 
            size="lg" 
            className="flex items-center gap-2" 
            asChild
          >
            <a
              href={`https://www.youtube.com/@secondecwailorin`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube className="h-4 w-4" />
              Visit Our Channel
            </a>
          </Button>

          <Button variant="outline" size="lg" className="flex items-center gap-2" asChild>
            <a
              href={liveDashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Manage Stream
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeLive;
