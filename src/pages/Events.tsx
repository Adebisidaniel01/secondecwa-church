import { useState } from "react";
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";

const Events = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const events = [
    {
      id: 1,
      title: "Christmas Eve Candlelight Service",
      date: "2024-12-24",
      time: "7:00 PM & 11:00 PM",
      location: "Main Sanctuary",
      category: "Special Service",
      description: "Join us for a beautiful candlelight service as we celebrate the birth of our Savior. This intimate worship experience includes carols, scripture readings, and the lighting of candles.",
      capacity: 300,
      registered: 45,
      featured: true
    },
    {
      id: 2,
      title: "New Year Prayer & Fasting",
      date: "2025-01-01",
      time: "6:00 AM - 6:00 PM",
      location: "Prayer Chapel",
      category: "Prayer",
      description: "Start the new year with prayer and fasting. Join us for a day of seeking God's guidance and blessing for the year ahead.",
      capacity: 50,
      registered: 23,
      featured: false
    },
    {
      id: 3,
      title: "Youth Winter Retreat",
      date: "2025-01-15",
      time: "Friday 6:00 PM - Sunday 3:00 PM",
      location: "Mountain View Camp",
      category: "Youth",
      description: "A weekend of fun, fellowship, and spiritual growth for our youth. Activities include worship, games, workshops, and outdoor adventures.",
      capacity: 40,
      registered: 28,
      featured: false
    },
    {
      id: 4,
      title: "Marriage Enrichment Workshop",
      date: "2025-01-25",
      time: "9:00 AM - 4:00 PM",
      location: "Fellowship Hall",
      category: "Workshop",
      description: "Strengthen your marriage with practical tools and biblical principles. Includes lunch and childcare.",
      capacity: 30,
      registered: 18,
      featured: false
    },
    {
      id: 5,
      title: "Community Food Drive",
      date: "2025-02-01",
      time: "10:00 AM - 2:00 PM",
      location: "Church Parking Lot",
      category: "Outreach",
      description: "Help us serve our community by donating non-perishable food items and volunteering at our monthly food drive.",
      capacity: null,
      registered: 35,
      featured: false
    },
    {
      id: 6,
      title: "Valentine's Couples Dinner",
      date: "2025-02-14",
      time: "6:00 PM - 9:00 PM",
      location: "Fellowship Hall",
      category: "Fellowship",
      description: "Celebrate love and friendship at our annual Valentine's dinner. Enjoy great food, music, and fellowship with other couples.",
      capacity: 60,
      registered: 42,
      featured: false
    }
  ];

  const categories = [
    { name: "All Events", value: "all", color: "bg-primary" },
    { name: "Special Service", value: "Special Service", color: "bg-sanctuary" },
    { name: "Youth", value: "Youth", color: "bg-worship" },
    { name: "Workshop", value: "Workshop", color: "bg-blessing" },
    { name: "Outreach", value: "Outreach", color: "bg-secondary" },
    { name: "Fellowship", value: "Fellowship", color: "bg-accent" },
    { name: "Prayer", value: "Prayer", color: "bg-muted" }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredEvents = selectedCategory === "all" 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const featuredEvent = events.find(event => event.featured);
  const upcomingEvents = filteredEvents.filter(event => !event.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : "bg-primary";
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6">
              Upcoming Events
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join us for meaningful gatherings, special services, and community events 
              that strengthen our faith and fellowship.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
                Featured Event
              </h2>
              <p className="text-lg text-muted-foreground">
                Don't miss this special upcoming event
              </p>
            </div>

            <Card className="overflow-hidden church-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative">
                  <div className="h-64 lg:h-full worship-gradient flex items-center justify-center text-worship-foreground">
                    <div className="text-center">
                      <Calendar className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-playfair font-bold">Special Event</h3>
                    </div>
                  </div>
                </div>
                <div className="p-8 lg:p-12">
                  <div className="space-y-6">
                    <div>
                      <Badge className={`${getCategoryColor(featuredEvent.category)} text-white mb-4`}>
                        {featuredEvent.category}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl font-playfair font-bold text-foreground mb-4">
                        {featuredEvent.title}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {featuredEvent.description}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="font-medium">{formatDate(featuredEvent.date)}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>{featuredEvent.time}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>{featuredEvent.location}</span>
                      </div>
                      {featuredEvent.capacity && (
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-primary" />
                          <span>{featuredEvent.registered}/{featuredEvent.capacity} registered</span>
                        </div>
                      )}
                    </div>

                    <Button size="lg" className="sanctuary-gradient text-sanctuary-foreground hover:opacity-90">
                      <Heart className="h-5 w-5 mr-2" />
                      Register Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-playfair font-bold text-foreground mb-6">
              Browse by Category
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={selectedCategory === category.value ? `${category.color} text-white` : ""}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 || upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No events found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-lg smooth-transition">
                  <div className="relative">
                    <div className={`h-32 ${getCategoryColor(event.category)} flex items-center justify-center text-white rounded-t-lg`}>
                      <div className="text-center">
                        <Calendar className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">{event.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary smooth-transition mb-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      {event.capacity && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span>{event.registered}/{event.capacity} spots</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <Button size="sm" className="w-full" variant="outline">
                        Learn More & Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6">
            Stay Connected
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Don't miss out on upcoming events and special announcements. 
            Subscribe to our newsletter or follow us on social media.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="worship-gradient text-worship-foreground hover:opacity-90">
              Subscribe to Newsletter
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Follow on Social Media
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;