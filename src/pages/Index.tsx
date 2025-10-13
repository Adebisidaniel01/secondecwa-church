import { Calendar, Clock, Users, BookOpen, MapPin, Play, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import heroImage from "@/assets/church-hero.jpg";
import pastorSpeaking from "@/assets/pastor-speaking.jpg";
import sermonImage from "@/assets/sermon-scene.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [isLive, setIsLive] = useState(false);
  const [channelId, setChannelId] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchYouTubeSettings = async () => {
      const { data } = await supabase
        .from('youtube_settings')
        .select('*')
        .limit(1)
        .single();

      if (data) {
        setIsLive(data.is_live || false);
        setChannelId(data.channel_id);
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
            setChannelId(payload.new.channel_id || null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleWatchLive = () => {
    if (isLive && channelId) {
      window.open(`https://www.youtube.com/channel/${channelId}/live`, '_blank');
    } else {
      toast({
        title: "No Live Stream",
        description: "Nothing streaming at the moment, check back later.",
        variant: "default",
      });
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        > 
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 fade-in">
            {t('home.welcomeHome')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto fade-in">
            {t('home.welcomeText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
            <Button 
              size="lg" 
              className="worship-gradient text-worship-foreground hover:opacity-90 text-lg px-8 py-4"
              onClick={handleWatchLive}
            >
              <Play className="h-5 w-5 mr-2" />
              {t('home.watchLive')}
            </Button>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
              {t('home.joinUsThisWeek')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.joinUsText')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 church-shadow hover:shadow-lg smooth-transition">
              <CardContent className="space-y-4">
                <div className="p-4 rounded-full sanctuary-gradient w-fit mx-auto">
                  <Clock className="h-8 w-8 text-sanctuary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">{t('home.sundayWorship')}</h3>
                <p className="text-lg font-playfair font-bold text-primary">{t('home.englishService')}</p>
                <p className="text-lg font-playfair font-bold text-primary">{t('home.yorubaService')}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 blessing-shadow hover:shadow-lg smooth-transition">
              <CardContent className="space-y-4">
                <div className="p-4 rounded-full blessing-gradient w-fit mx-auto">
                  <BookOpen className="h-8 w-8 text-blessing-foreground" />
                </div>
                <h3 className="text-xl font-semibold">{t('home.bibleStudy')}</h3>
                <p className="text-2xl font-playfair font-bold text-primary">{t('home.bibleStudyTime')}</p>
                <p className="text-muted-foreground">{t('home.bibleStudyText')}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 worship-shadow hover:shadow-lg smooth-transition">
              <CardContent className="space-y-4">
                <div className="p-4 rounded-full worship-gradient w-fit mx-auto">
                  <Users className="h-8 w-8 text-worship-foreground" />
                </div>
                <h3 className="text-xl font-semibold">{t('home.youthGroup')}</h3>
                <p className="text-2xl font-playfair font-bold text-primary">{t('home.youthGroupTime')}</p>
                <p className="text-muted-foreground">{t('home.youthGroupText')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6">
                {t('home.ourHeartMission')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t('home.missionText1')}
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {t('home.missionText2')}
              </p>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                {t('home.learnMore')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
            <div className="relative">
              <img 
                src={pastorSpeaking} 
                alt="Pastor speaking" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 p-6 bg-card rounded-xl shadow-lg border">
                <div className="flex items-center space-x-3">
                  <Heart className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold">{t('home.members')}</p>
                    <p className="text-sm text-muted-foreground">{t('home.growingTogether')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
              {t('home.getConnected')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('home.getConnectedText')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="/sermons" className="block">
              <Card className="group hover:shadow-lg smooth-transition cursor-pointer h-full">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto group-hover:bg-primary/20 smooth-transition">
                    <Play className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{t('home.latestSermons')}</h3>
                  <p className="text-sm text-muted-foreground">{t('home.latestSermonsText')}</p>
                </CardContent>
              </Card>
            </a>

            <a href="/events" className="block">
              <Card className="group hover:shadow-lg smooth-transition cursor-pointer h-full">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto group-hover:bg-primary/20 smooth-transition">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{t('home.upcomingEvents')}</h3>
                  <p className="text-sm text-muted-foreground">{t('home.upcomingEventsText')}</p>
                </CardContent>
              </Card>
            </a>

            <a href="/give" className="block">
              <Card className="group hover:shadow-lg smooth-transition cursor-pointer h-full">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto group-hover:bg-primary/20 smooth-transition">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{t('home.giveOnline')}</h3>
                  <p className="text-sm text-muted-foreground">{t('home.giveOnlineText')}</p>
                </CardContent>
              </Card>
            </a>

            <a href="/contact" className="block">
              <Card className="group hover:shadow-lg smooth-transition cursor-pointer h-full">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto group-hover:bg-primary/20 smooth-transition">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{t('home.visitUs')}</h3>
                  <p className="text-sm text-muted-foreground">{t('home.visitUsText')}</p>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Sermon */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src={sermonImage} 
                alt="Pastor preaching" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                <Button size="lg" className="worship-gradient text-worship-foreground hover:opacity-90">
                  <Play className="h-6 w-6 mr-2" />
                  {t('home.watchSermon')}
                </Button>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-primary mb-2">{t('home.thisWeekMessage')}</div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
                {t('home.featuredSermonTitle')}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t('home.featuredSermonText')}
              </p>
              <div className="space-y-3 mb-6">
                <p className="text-sm text-muted-foreground">
                  <strong>{t('home.scripture')}:</strong> {t('home.scriptureRef')}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>{t('home.date')}:</strong> {t('home.sermonDate')}
                </p>
              </div>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                {t('home.viewAllSermons')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
