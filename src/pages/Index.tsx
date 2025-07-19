import { Calendar, Clock, Heart, Users, BookOpen, MapPin, Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import heroImage from "@/assets/church-hero.jpg";
import communityImage from "@/assets/community-prayer.jpg";
import sermonImage from "@/assets/sermon-scene.jpg";

const Index = () => {
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
            Welcome Home
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto fade-in">
            Where faith grows, hearts are healed, and lives are transformed through God's love and community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
            <Button size="lg" className="worship-gradient text-worship-foreground hover:opacity-90 text-lg px-8 py-4">
              <Play className="h-5 w-5 mr-2" />
              Watch Live
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
              Plan Your Visit
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
              Join Us This Week
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Come as you are and experience the love of God in our welcoming community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 church-shadow hover:shadow-lg smooth-transition">
              <CardContent className="space-y-4">
                <div className="p-4 rounded-full sanctuary-gradient w-fit mx-auto">
                  <Clock className="h-8 w-8 text-sanctuary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Sunday Worship</h3>
                <p className="text-2xl font-playfair font-bold text-primary">9:00 AM & 11:00 AM</p>
                <p className="text-muted-foreground">Traditional and Contemporary Services</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 blessing-shadow hover:shadow-lg smooth-transition">
              <CardContent className="space-y-4">
                <div className="p-4 rounded-full blessing-gradient w-fit mx-auto">
                  <BookOpen className="h-8 w-8 text-blessing-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Bible Study</h3>
                <p className="text-2xl font-playfair font-bold text-primary">Wednesday 7:00 PM</p>
                <p className="text-muted-foreground">Deep dive into God's Word together</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 worship-shadow hover:shadow-lg smooth-transition">
              <CardContent className="space-y-4">
                <div className="p-4 rounded-full worship-gradient w-fit mx-auto">
                  <Users className="h-8 w-8 text-worship-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Youth Group</h3>
                <p className="text-2xl font-playfair font-bold text-primary">Friday 6:30 PM</p>
                <p className="text-muted-foreground">Fun, faith, and fellowship for teens</p>
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
                Our Heart & Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                For over 20 years, Second ECWA has been a beacon of hope and love in our community. 
                We believe in the transformative power of faith, the strength of community, and the 
                importance of serving others with compassion and grace.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Whether you're seeking spiritual guidance, looking for a place to belong, or wanting to 
                make a difference in the world, you'll find your home here with us.
              </p>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Learn More About Us
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
            <div className="relative">
              <img 
                src={communityImage} 
                alt="Community in prayer" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 p-6 bg-card rounded-xl shadow-lg border">
                <div className="flex items-center space-x-3">
                  <Heart className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold">500+ Members</p>
                    <p className="text-sm text-muted-foreground">Growing in faith together</p>
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
              Get Connected
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore ways to grow in faith and serve our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg smooth-transition cursor-pointer">
              <CardContent className="p-6 text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto group-hover:bg-primary/20 smooth-transition">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Latest Sermons</h3>
                <p className="text-sm text-muted-foreground">Listen to recent messages and find inspiration</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg smooth-transition cursor-pointer">
              <CardContent className="p-6 text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto group-hover:bg-primary/20 smooth-transition">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Upcoming Events</h3>
                <p className="text-sm text-muted-foreground">Join us for special services and activities</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg smooth-transition cursor-pointer">
              <CardContent className="p-6 text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto group-hover:bg-primary/20 smooth-transition">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Give Online</h3>
                <p className="text-sm text-muted-foreground">Support our mission and community outreach</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg smooth-transition cursor-pointer">
              <CardContent className="p-6 text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto group-hover:bg-primary/20 smooth-transition">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Visit Us</h3>
                <p className="text-sm text-muted-foreground">Find directions and plan your first visit</p>
              </CardContent>
            </Card>
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
                  Watch Sermon
                </Button>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-primary mb-2">This Week's Message</div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
                "Walking in Faith, Not Fear"
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Join Samuel Oyegunle as he explores how faith can overcome our deepest fears and 
                uncertainties. Discover the peace that comes from trusting in God's perfect plan 
                for your life.
              </p>
              <div className="space-y-3 mb-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Scripture:</strong> Isaiah 41:10
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Date:</strong> May 15, 2025
                </p>
              </div>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View All Sermons
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
