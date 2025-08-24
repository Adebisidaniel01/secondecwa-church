import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Play, Square, Settings, Video, Youtube, BarChart, Users, FileText, LogOut } from "lucide-react";
import Layout from "@/components/Layout";
import YouTubeLive from "@/components/YouTubeLive";

interface Video {
  id: string;
  title: string;
  description: string;
  file_url: string;
  thumbnail_url: string;
  upload_date: string;
  duration: number;
  file_size: number;
}

interface YouTubeSettings {
  channel_name: string;
  is_live: boolean;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [youtubeSettings, setYoutubeSettings] = useState<YouTubeSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // YouTube configuration form
  const [ytApiKey, setYtApiKey] = useState("");
  const [ytChannelId, setYtChannelId] = useState("");
  const [ytChannelName, setYtChannelName] = useState("");
  const [ytStreamKey, setYtStreamKey] = useState("");

  // Live stream form
  const [liveTitle, setLiveTitle] = useState("");
  const [liveDescription, setLiveDescription] = useState("");

  // Video upload form
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      verifyToken(savedToken);
    }
    fetchYouTubeStatus();
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const { data } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'verify', token: tokenToVerify }
      });

      if (data.valid) {
        setToken(tokenToVerify);
        setIsAuthenticated(true);
        fetchVideos();
      } else {
        localStorage.removeItem("admin_token");
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', password }
      });

      if (error) throw error;

      if (data.success) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem("admin_token", data.token);
        fetchVideos();
        toast({
          title: "Success",
          description: data.message || "Logged in successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Invalid password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Login failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data } = await supabase.functions.invoke('video-upload', {
        body: { action: 'list', token }
      });

      if (data.videos) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

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
    }
  };

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Save video metadata
      const { data, error } = await supabase.functions.invoke('video-upload', {
        body: {
          action: 'upload',
          token,
          videoData: {
            title: videoTitle,
            description: videoDescription,
            fileUrl: publicUrl,
            thumbnailUrl: null,
            duration: 0, // Would need video processing to get actual duration
            fileSize: selectedFile.size
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video uploaded successfully",
      });

      setVideoTitle("");
      setVideoDescription("");
      setSelectedFile(null);
      fetchVideos();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleYouTubeConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('youtube-integration', {
        body: {
          action: 'configure',
          token,
          youtubeData: {
            apiKey: ytApiKey,
            channelId: ytChannelId,
            channelName: ytChannelName,
            liveStreamKey: ytStreamKey
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "YouTube configured successfully",
      });

      fetchYouTubeStatus();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to configure YouTube",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoLive = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-integration', {
        body: {
          action: 'go-live',
          token,
          youtubeData: {
            title: liveTitle,
            description: liveDescription
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Live stream started!",
      });

      fetchYouTubeStatus();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start live stream",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStopLive = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-integration', {
        body: { action: 'stop-live', token }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Live stream stopped",
      });

      fetchYouTubeStatus();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop live stream",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Developer Access</CardTitle>
              <CardDescription>
                Enter your password to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Authenticating..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setToken("");
    setPassword("");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Developer Dashboard</h1>
          <div className="flex gap-4 items-center">
            {youtubeSettings && (
              <Badge variant={youtubeSettings.is_live ? "destructive" : "secondary"}>
                {youtubeSettings.is_live ? "🔴 LIVE" : "⚫ OFFLINE"}
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Videos</p>
                  <p className="text-2xl font-bold">{videos.length}</p>
                </div>
                <Video className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">YouTube Status</p>
                  <p className="text-2xl font-bold">{youtubeSettings?.is_live ? "LIVE" : "OFFLINE"}</p>
                </div>
                <Youtube className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Channel</p>
                  <p className="text-sm font-semibold truncate">{youtubeSettings?.channel_name || "Not Connected"}</p>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quick Action</p>
                  <p className="text-sm text-muted-foreground">Go Live</p>
                </div>
                <Play className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* YouTube Live Component */}
        <div className="mb-8">
          <YouTubeLive />
        </div>

        <Tabs defaultValue="live" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Go Live
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              YouTube Settings
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVideoUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="video-title">Title</Label>
                    <Input
                      id="video-title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="video-description">Description</Label>
                    <Textarea
                      id="video-description"
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="video-file">Video File</Label>
                    <Input
                      id="video-file"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload Video"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Uploaded Videos ({videos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {videos.map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {new Date(video.upload_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                  {videos.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No videos uploaded yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="youtube" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  YouTube Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleYouTubeConfig} className="space-y-4">
                  <div>
                    <Label htmlFor="yt-api-key">YouTube API Key</Label>
                    <Input
                      id="yt-api-key"
                      type="password"
                      value={ytApiKey}
                      onChange={(e) => setYtApiKey(e.target.value)}
                      placeholder="Your YouTube API key"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yt-channel-id">Channel ID</Label>
                    <Input
                      id="yt-channel-id"
                      value={ytChannelId}
                      onChange={(e) => setYtChannelId(e.target.value)}
                      placeholder="Your YouTube channel ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yt-channel-name">Channel Name</Label>
                    <Input
                      id="yt-channel-name"
                      value={ytChannelName}
                      onChange={(e) => setYtChannelName(e.target.value)}
                      placeholder="Your YouTube channel name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yt-stream-key">Live Stream Key</Label>
                    <Input
                      id="yt-stream-key"
                      type="password"
                      value={ytStreamKey}
                      onChange={(e) => setYtStreamKey(e.target.value)}
                      placeholder="Your YouTube live stream key"
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Configuration"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Go Live Card */}
              <Card className="border-2 border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <Play className="h-5 w-5" />
                    Go Live Now
                  </CardTitle>
                  <CardDescription>
                    {youtubeSettings?.channel_name 
                      ? `Ready to broadcast to: ${youtubeSettings.channel_name}`
                      : "Configure YouTube settings first to go live"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="live-title">Stream Title</Label>
                    <Input
                      id="live-title"
                      value={liveTitle}
                      onChange={(e) => setLiveTitle(e.target.value)}
                      placeholder="Sunday Service - Live Stream"
                    />
                  </div>
                  <div>
                    <Label htmlFor="live-description">Stream Description</Label>
                    <Textarea
                      id="live-description"
                      value={liveDescription}
                      onChange={(e) => setLiveDescription(e.target.value)}
                      placeholder="Join us for our live Sunday service..."
                    />
                  </div>
                  <div className="flex gap-2">
                    {!youtubeSettings?.is_live ? (
                      <Button 
                        onClick={handleGoLive} 
                        disabled={loading || !youtubeSettings}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                        size="lg"
                      >
                        <Play className="h-5 w-5" />
                        {loading ? "Starting..." : "Go Live"}
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleStopLive} 
                        disabled={loading}
                        variant="destructive"
                        className="flex items-center gap-2"
                        size="lg"
                      >
                        <Square className="h-5 w-5" />
                        {loading ? "Stopping..." : "Stop Live Stream"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Live Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-600" />
                    Live Stream Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={youtubeSettings?.is_live ? "destructive" : "secondary"} className="text-sm">
                      {youtubeSettings?.is_live ? "🔴 LIVE NOW" : "⚫ OFFLINE"}
                    </Badge>
                  </div>
                  {youtubeSettings?.channel_name && (
                    <div>
                      <p className="text-sm font-medium">Channel:</p>
                      <p className="text-muted-foreground">{youtubeSettings.channel_name}</p>
                    </div>
                  )}
                  {youtubeSettings?.is_live && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        🔴 Your stream is currently live! Viewers can watch on YouTube.
                      </p>
                    </div>
                  )}
                  {!youtubeSettings?.is_live && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Ready to go live when you are. Make sure your streaming software is configured with your stream key.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Site Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Monitor your website performance and visitor analytics.</p>
                  <Button variant="outline" className="w-full">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Manage website users and permissions.</p>
                  <Button variant="outline" className="w-full">
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Content Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Edit pages, sermons, and other website content.</p>
                  <Button variant="outline" className="w-full">
                    Edit Content
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;