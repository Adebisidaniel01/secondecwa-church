import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Play, Calendar, Clock } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  file_url: string;
  thumbnail_url: string;
  upload_date: string;
  duration: number;
  file_size: number;
  is_featured: boolean;
}

const VideoGallery = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
    
    // Set up real-time updates
    const channel = supabase
      .channel('video-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'videos'
        },
        () => {
          fetchVideos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        return;
      }

      setVideos(data || []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-48 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Videos Yet</h3>
          <p className="text-muted-foreground">
            Check back soon for our latest sermons and content.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured Video */}
      {videos.find(v => v.is_featured) && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Video</h2>
          {(() => {
            const featured = videos.find(v => v.is_featured)!;
            return (
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <video 
                    className="w-full h-full object-cover"
                    poster={featured.thumbnail_url || undefined}
                    controls
                  >
                    <source src={featured.file_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Badge className="absolute top-4 left-4">Featured</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{featured.title}</h3>
                  <p className="text-muted-foreground mb-4">{featured.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(featured.upload_date).toLocaleDateString()}
                    </div>
                    {featured.duration > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(featured.duration)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </div>
      )}

      {/* Video Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">All Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <video 
                  className="w-full h-full object-cover"
                  poster={video.thumbnail_url || undefined}
                  preload="metadata"
                >
                  <source src={video.file_url} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button 
                    size="lg"
                    className="rounded-full"
                    onClick={() => {
                      const videoElement = document.createElement('video');
                      videoElement.src = video.file_url;
                      videoElement.controls = true;
                      videoElement.autoplay = true;
                      videoElement.className = 'w-full h-full';
                      
                      const modal = document.createElement('div');
                      modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
                      modal.onclick = () => modal.remove();
                      
                      const container = document.createElement('div');
                      container.className = 'max-w-4xl w-full aspect-video';
                      container.appendChild(videoElement);
                      modal.appendChild(container);
                      document.body.appendChild(modal);
                    }}
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
                {video.is_featured && (
                  <Badge className="absolute top-2 left-2">Featured</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(video.upload_date).toLocaleDateString()}
                  </div>
                  {video.duration > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(video.duration)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;