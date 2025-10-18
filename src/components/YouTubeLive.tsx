import { Youtube, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const YouTubeLive = () => {
const channelId = "UCFM8ROf93C7j_D6MDL0h42Q"; // Your YouTube Channel ID
const channelName = "Second ECWA Church, Ilorin"; // Display name
const embedUrl = "https://www.youtube.com/embed/0ovoFpgVB80"; // Direct embed link
const channelUrl = `https://www.youtube.com/channel/${channelId}`;
const liveDashboardUrl = "https://studio.youtube.com/channel/UCFM8ROf93C7j_D6MDL0h42Q/livestreaming";



  const [embedError, setEmbedError] = useState(false);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          Live Stream
        </CardTitle>
        <CardDescription>{channelName}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary">🎥 Stream Control & Viewing</Badge>
        </div>

        {/* Embedded YouTube player OR fallback */}
        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-border bg-black flex items-center justify-center">
          {!embedError ? (
            <iframe
              src={embedUrl}
              title="YouTube Live Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-[400px] md:h-[500px]"
              onError={() => setEmbedError(true)}
            ></iframe>
          ) : (
            <div className="text-center text-gray-300 p-6">
              <p className="mb-3">🔒 Unable to display the live stream in this preview.</p>
              <Button asChild>
                <a
                  href={`${channelUrl}/live`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="h-4 w-4 mr-2" />
                  Watch Live on YouTube
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button className="flex items-center gap-2" asChild>
            <a
              href={liveDashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Manage Stream (YouTube Live Dashboard)
            </a>
          </Button>

          <Button variant="outline" className="flex items-center gap-2" asChild>
            <a
              href={`${channelUrl}/live`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube className="h-4 w-4" />
              Watch Live on YouTube
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeLive;
