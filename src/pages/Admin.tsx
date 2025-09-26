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
import { Upload, Play, Square, Settings, Video, Youtube, BarChart, Users, FileText, LogOut, MessageSquare, Mail, Calendar, Heart, DollarSign, Megaphone, Church, Camera } from "lucide-react";
import PhotoUploadAdmin from "@/components/admin/PhotoUploadAdmin";
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

interface PrayerRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  request: string;
  is_urgent: boolean;
  is_confidential: boolean;
  status: string;
  created_at: string;
}

interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface EventRegistration {
  id: string;
  event_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  attendance_status: string;
  registration_date: string;
}

interface NewsletterSubscription {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subscription_type: string;
  is_active: boolean;
  created_at: string;
}

interface MinistryVolunteer {
  id: string;
  ministry_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  is_active: boolean;
  start_date: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [youtubeSettings, setYoutubeSettings] = useState<YouTubeSettings | null>(null);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [ministryVolunteers, setMinistryVolunteers] = useState<MinistryVolunteer[]>([]);
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
        fetchAllData();
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
        fetchAllData();
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

  const fetchAllData = async () => {
    await Promise.all([
      fetchVideos(),
      fetchPrayerRequests(),
      fetchContactSubmissions(),
      fetchEventRegistrations(),
      fetchNewsletterSubscriptions(),
      fetchMinistryVolunteers(),
    ]);
  };

  const fetchPrayerRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrayerRequests(data || []);
    } catch (error) {
      console.error('Failed to fetch prayer requests:', error);
    }
  };

  const fetchContactSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContactSubmissions(data || []);
    } catch (error) {
      console.error('Failed to fetch contact submissions:', error);
    }
  };

  const fetchEventRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .order('registration_date', { ascending: false });

      if (error) throw error;
      setEventRegistrations(data || []);
    } catch (error) {
      console.error('Failed to fetch event registrations:', error);
    }
  };

  const fetchNewsletterSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsletterSubscriptions(data || []);
    } catch (error) {
      console.error('Failed to fetch newsletter subscriptions:', error);
    }
  };

  const fetchMinistryVolunteers = async () => {
    try {
      const { data, error } = await supabase
        .from('ministry_volunteers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMinistryVolunteers(data || []);
    } catch (error) {
      console.error('Failed to fetch ministry volunteers:', error);
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

        {/* YouTube Live Component */}
        <div className="mb-8">
          <YouTubeLive />
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 gap-1">
            <TabsTrigger value="dashboard" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <BarChart className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="prayers" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Heart className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Prayers</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="ministries" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Church className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Ministries</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Camera className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Photos</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Video className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => (document.querySelector('[value="prayers"]') as HTMLElement)?.click()}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-muted-foreground">Prayer Requests</p>
                      <p className="text-xl md:text-2xl font-bold">{prayerRequests.length}</p>
                      <p className="text-xs text-muted-foreground">
                        {prayerRequests.filter(p => p.is_urgent).length} urgent
                      </p>
                    </div>
                    <Heart className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => (document.querySelector('[value="contacts"]') as HTMLElement)?.click()}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-muted-foreground">Contact Messages</p>
                      <p className="text-xl md:text-2xl font-bold">{contactSubmissions.length}</p>
                      <p className="text-xs text-muted-foreground">
                        {contactSubmissions.filter(c => c.status === 'unread').length} unread
                      </p>
                    </div>
                    <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => (document.querySelector('[value="events"]') as HTMLElement)?.click()}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-muted-foreground">Event Registrations</p>
                      <p className="text-xl md:text-2xl font-bold">{eventRegistrations.length}</p>
                      <p className="text-xs text-muted-foreground">All time</p>
                    </div>
                    <Calendar className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => (document.querySelector('[value="ministries"]') as HTMLElement)?.click()}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-muted-foreground">Newsletter Subscribers</p>
                      <p className="text-xl md:text-2xl font-bold">{newsletterSubscriptions.filter(s => s.is_active).length}</p>
                      <p className="text-xs text-muted-foreground">Active subscribers</p>
                    </div>
                    <Mail className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prayers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Prayer Requests ({prayerRequests.length})
                </CardTitle>
                <CardDescription>
                  Manage and respond to prayer requests from your community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prayerRequests.map((prayer) => (
                    <div key={prayer.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{prayer.name}</h3>
                          {prayer.is_urgent && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                          {prayer.is_confidential && (
                            <Badge variant="secondary" className="text-xs">Confidential</Badge>
                          )}
                        </div>
                        <Badge variant={prayer.status === 'active' ? 'default' : 'secondary'}>
                          {prayer.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{prayer.request}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{prayer.email}</span>
                        {prayer.phone && <span>{prayer.phone}</span>}
                        <span>{new Date(prayer.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {prayerRequests.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No prayer requests yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Messages ({contactSubmissions.length})
                </CardTitle>
                <CardDescription>
                  View and respond to contact form submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactSubmissions.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{contact.first_name} {contact.last_name}</h3>
                          <p className="text-sm font-medium text-primary">{contact.subject}</p>
                        </div>
                        <Badge variant={contact.status === 'unread' ? 'destructive' : 'secondary'}>
                          {contact.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{contact.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{contact.email}</span>
                        {contact.phone && <span>{contact.phone}</span>}
                        <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {contactSubmissions.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No contact messages yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Registrations ({eventRegistrations.length})
                </CardTitle>
                <CardDescription>
                  Manage event registrations and attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eventRegistrations.map((registration) => (
                    <div key={registration.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{registration.first_name} {registration.last_name}</h3>
                          <p className="text-sm text-muted-foreground">Event ID: {registration.event_id}</p>
                        </div>
                        <Badge variant={registration.attendance_status === 'registered' ? 'default' : 'secondary'}>
                          {registration.attendance_status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{registration.email}</span>
                        {registration.phone && <span>{registration.phone}</span>}
                        <span>Registered: {new Date(registration.registration_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {eventRegistrations.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No event registrations yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ministries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Church className="h-5 w-5" />
                  Ministry Volunteers ({ministryVolunteers.length})
                </CardTitle>
                <CardDescription>
                  Manage ministry volunteers and their positions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ministryVolunteers.map((volunteer) => (
                    <div key={volunteer.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{volunteer.first_name} {volunteer.last_name}</h3>
                          <p className="text-sm font-medium text-primary">{volunteer.position}</p>
                          <p className="text-xs text-muted-foreground">Ministry ID: {volunteer.ministry_id}</p>
                        </div>
                        <Badge variant={volunteer.is_active ? 'default' : 'secondary'}>
                          {volunteer.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{volunteer.email}</span>
                        {volunteer.phone && <span>{volunteer.phone}</span>}
                        <span>Started: {new Date(volunteer.start_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {ministryVolunteers.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No ministry volunteers yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Newsletter Subscriptions ({newsletterSubscriptions.length})
                </CardTitle>
                <CardDescription>
                  Manage newsletter subscribers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsletterSubscriptions.map((subscription) => (
                    <div key={subscription.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{subscription.first_name} {subscription.last_name}</h3>
                          <p className="text-sm text-muted-foreground">{subscription.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{subscription.subscription_type}</Badge>
                          <Badge variant={subscription.is_active ? 'default' : 'secondary'}>
                            {subscription.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Subscribed: {new Date(subscription.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {newsletterSubscriptions.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No newsletter subscriptions yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Photo Gallery Management
                </CardTitle>
                <CardDescription>
                  Upload and manage photos for the church gallery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PhotoUploadAdmin />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Tabs defaultValue="videos" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="videos" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="live" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Go Live
                </TabsTrigger>
                <TabsTrigger value="youtube" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube Settings
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
                      <Youtube className="h-5 w-5" />
                      YouTube Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure your YouTube channel for live streaming
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleYouTubeConfig} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="api-key">API Key</Label>
                          <Input
                            id="api-key"
                            type="password"
                            value={ytApiKey}
                            onChange={(e) => setYtApiKey(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="channel-id">Channel ID</Label>
                          <Input
                            id="channel-id"
                            value={ytChannelId}
                            onChange={(e) => setYtChannelId(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="channel-name">Channel Name</Label>
                          <Input
                            id="channel-name"
                            value={ytChannelName}
                            onChange={(e) => setYtChannelName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="stream-key">Stream Key</Label>
                          <Input
                            id="stream-key"
                            type="password"
                            value={ytStreamKey}
                            onChange={(e) => setYtStreamKey(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Configuring..." : "Save Configuration"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="live" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Live Streaming Controls
                    </CardTitle>
                    <CardDescription>
                      Start or stop live streaming to YouTube
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {youtubeSettings?.is_live ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-red-800">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="font-semibold">LIVE NOW</span>
                          </div>
                          <p className="text-red-700 text-sm mt-1">
                            Your stream is currently broadcasting to YouTube
                          </p>
                        </div>
                        <Button 
                          onClick={handleStopLive} 
                          variant="destructive" 
                          disabled={loading}
                          className="w-full"
                        >
                          <Square className="mr-2 h-4 w-4" />
                          {loading ? "Stopping..." : "Stop Live Stream"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="live-title">Stream Title</Label>
                          <Input
                            id="live-title"
                            value={liveTitle}
                            onChange={(e) => setLiveTitle(e.target.value)}
                            placeholder="Enter your live stream title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="live-description">Stream Description</Label>
                          <Textarea
                            id="live-description"
                            value={liveDescription}
                            onChange={(e) => setLiveDescription(e.target.value)}
                            placeholder="Describe your live stream"
                          />
                        </div>
                        <Button 
                          onClick={handleGoLive} 
                          className="w-full"
                          disabled={loading}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          {loading ? "Starting..." : "Go Live"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;