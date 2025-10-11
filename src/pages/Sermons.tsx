import { useState, useEffect } from "react";
import { Play, Calendar, Search, Filter, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import sermonImage from "@/assets/sermon-scene.jpg";

const Sermons = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("all");
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      setSermons(data || []);
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultSermons = [
    {
      id: 1,
      title: "Walking in Faith, Not Fear",
      speaker: "Pastor Samuel Oyegunle",
      date: "May 15, 2025",
      series: "Faith Over Fear",
      scripture: "Isaiah 41:10",
      duration: "32 min",
      description: "Discover how faith can overcome our deepest fears and uncertainties. Learn to trust in God's perfect plan for your life.",
      image: sermonImage,
      featured: true,
      audio_url: "https://www.youtube.com/@secondecwailorin",
      video_url: "https://www.youtube.com/@secondecwailorin"
    },
    {
      id: 2,
      title: "The Power of Community",
      speaker: "Pastor Samuel Oyegunle",
      date: "December 8, 2024",
      series: "Together We Rise",
      scripture: "Hebrews 10:24-25",
      duration: "28 min",
      description: "Exploring the importance of Christian fellowship and how we can support one another in faith.",
      image: sermonImage,
      featured: false,
      audio_url: "https://www.youtube.com/@secondecwailorin",
      video_url: "https://www.youtube.com/@secondecwailorin"
    },
    {
      id: 3,
      title: "Hope in Hard Time",
      speaker: "Pastor Malik Emmanuel",
      date: "February 1, 2025",
      series: "Faith Over Fear",
      scripture: "Romans 15:13",
      duration: "35 min",
      description: "Finding hope and strength when facing life's most difficult challenges through God's promises.",
      image: sermonImage,
      featured: false,
      audio_url: "https://www.youtube.com/@secondecwailorin",
      video_url: "https://www.youtube.com/@secondecwailorin"
    },
    {
      id: 4,
      title: "Parents relation with their children",
      speaker: "Guest Speaker: Mr. Aderemi-Babatunde",
      date: "April 24, 2025",
      series: "Heart of Love",
      scripture: "1 Corinthians 13:4-7",
      duration: "30 min",
      description: "Understanding the depth and breadth of Parents love and how we can reflect it to the behaviour of their childern.",
      image: sermonImage,
      featured: false,
      audio_url: "https://www.youtube.com/@secondecwailorin",
      video_url: "https://www.youtube.com/@secondecwailorin"
    },
    {
      id: 5,
      title: "Serving with Joy",
      speaker: "Reverend Ayebulu Emmanuel",
      date: "January 17, 2025",
      series: "Together We Rise",
      scripture: "Galatians 5:13",
      duration: "26 min",
      description: "Discovering the joy that comes from serving others and making a difference in our community.",
      image: sermonImage,
      featured: false,
      audio_url: "https://www.youtube.com/@secondecwailorin",
      video_url: "https://www.youtube.com/@secondecwailorin"
    },
    {
      id: 6,
      title: "Prayers That Move Mountains",
      speaker: "Reverend Emmanuel Ayebulu",
      date: "June 10, 2025",
      series: "Faith Over Fear",
      scripture: "Matthew 17:20",
      duration: "33 min",
      description: "Learning to pray with faith and confidence, knowing that God hears and answers our prayers.",
      image: sermonImage,
      featured: false,
      audio_url: "https://www.youtube.com/@secondecwailorin",
      video_url: "https://www.youtube.com/@secondecwailorin"
    }
  ];

  // Use fetched sermons if available, otherwise use default data
  const displaySermons = sermons.length > 0 ? sermons.map(sermon => ({
    id: sermon.id,
    title: sermon.title,
    speaker: sermon.speaker,
    date: new Date(sermon.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    series: sermon.series || 'General',
    scripture: sermon.scripture,
    duration: `${sermon.duration} min`,
    description: sermon.description,
    image: sermonImage,
    featured: sermon.is_featured,
    audio_url: sermon.audio_url,
    video_url: sermon.video_url
  })) : defaultSermons;

  const series = [
    { value: "all", label: "All Series" },
    { value: "faith-over-fear", label: "Faith Over Fear" },
    { value: "together-we-rise", label: "Together We Rise" },
    { value: "heart-of-love", label: "Heart of Love" }
  ];

  const filteredSermons = displaySermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.scripture.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeries = selectedSeries === "all" || 
                         sermon.series.toLowerCase().replace(/\s+/g, '-') === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  const featuredSermon = displaySermons.find(sermon => sermon.featured);
  const recentSermons = filteredSermons.filter(sermon => !sermon.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6">
              Sermons & Messages
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Be inspired, encouraged, and challenged by God's Word through our weekly messages.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Sermon */}
      {featuredSermon && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
                Latest Message
              </h2>
              <p className="text-lg text-muted-foreground">
                Our most recent sermon is ready for you to watch or listen
              </p>
            </div>

            <Card className="overflow-hidden church-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative">
                  <img 
                    src={featuredSermon.image} 
                    alt={featuredSermon.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button 
                      size="lg" 
                      className="worship-gradient text-worship-foreground hover:opacity-90"
                      onClick={() => {
                        if (featuredSermon.video_url) {
                          window.open(featuredSermon.video_url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      <Play className="h-6 w-6 mr-2" />
                      Watch Now
                    </Button>
                  </div>
                </div>
                <div className="p-8 lg:p-12">
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-primary mb-2">{featuredSermon.series}</p>
                      <h3 className="text-2xl md:text-3xl font-playfair font-bold text-foreground mb-4">
                        {featuredSermon.title}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {featuredSermon.description}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span><strong>Speaker:</strong> {featuredSermon.speaker}</span>
                        <span><strong>Duration:</strong> {featuredSermon.duration}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span><strong>Scripture:</strong> {featuredSermon.scripture}</span>
                        <span><strong>Date:</strong> {featuredSermon.date}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      <Button 
                        className="sanctuary-gradient text-sanctuary-foreground"
                        onClick={() => {
                          if (featuredSermon.audio_url) {
                            window.open(featuredSermon.audio_url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        disabled={!featuredSermon.audio_url}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Listen
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          const url = featuredSermon.audio_url || featuredSermon.video_url;
                          if (url) {
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${featuredSermon.title}.mp3`;
                            link.click();
                          }
                        }}
                        disabled={!featuredSermon.audio_url && !featuredSermon.video_url}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: featuredSermon.title,
                              text: featuredSermon.description,
                              url: window.location.href
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Link copied to clipboard!');
                          }
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h2 className="text-2xl font-playfair font-bold text-foreground">
              Browse All Sermons
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sermons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by series" />
                </SelectTrigger>
                <SelectContent>
                  {series.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Sermon Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <CardContent className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredSermons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No sermons found matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentSermons.map((sermon) => (
                <Card key={sermon.id} className="group hover:shadow-lg smooth-transition cursor-pointer">
                  <div className="relative">
                    <img 
                      src={sermon.image} 
                      alt={sermon.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 smooth-transition rounded-t-lg flex items-center justify-center">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (sermon.video_url) {
                            window.open(sermon.video_url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        disabled={!sermon.video_url}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-primary mb-1">{sermon.series}</p>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary smooth-transition">
                        {sermon.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {sermon.description}
                      </p>
                    </div>
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>{sermon.speaker}</span>
                        <span>{sermon.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{sermon.scripture}</span>
                        <span>{sermon.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (sermon.audio_url) {
                            window.open(sermon.audio_url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        disabled={!sermon.audio_url}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Listen
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = sermon.audio_url || sermon.video_url;
                          if (url) {
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${sermon.title}.mp3`;
                            link.click();
                          }
                        }}
                        disabled={!sermon.audio_url && !sermon.video_url}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.share) {
                            navigator.share({
                              title: sermon.title,
                              text: sermon.description,
                              url: window.location.href
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                          }
                        }}
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

    </Layout>
  );
};

export default Sermons;
