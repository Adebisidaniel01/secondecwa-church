import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Heart, CalendarDays, Music, BookOpen, Baby, Utensils, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SocialLinks from "@/components/SocialLinks";
import eventsHeader from "@/assets/events-header.jpg";

const Events = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialNeeds: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true });

      if (error) throw error;
      
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsRegistering(true);

    try {
      const { error } = await supabase.functions.invoke('event-registration', {
        body: {
          eventId: selectedEvent.id,
          ...registrationForm
        }
      });

      if (error) throw error;

      toast({
        title: "Registration successful!",
        description: `You've been registered for ${selectedEvent.title}.`,
      });

      setRegistrationForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialNeeds: '',
        emergencyContact: '',
        emergencyPhone: ''
      });
      setSelectedEvent(null);
    } catch (error: any) {
      console.error('Error registering for event:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const defaultEvents = [
    {
      id: 1,
      title: "Christmas Eve Candlelight Service",
      date: "2025-12-24",
      time: "7:00 PM & 11:00 PM",
      location: "Main Sanctuary",
      category: "Special Service",
      description: "Join us for a beautiful candlelight service as we celebrate the birth of our Savior. This intimate worship experience includes carols, scripture readings, and the lighting of candles.",
      capacity: 300,
      registered: 45,
      featured: true,
      registration_required: true,
      registration_deadline: null
    },
    {
      id: 2,
      title: "New Year Prayer & Fasting",
      date: "2026-01-01",
      time: "6:00 AM - 6:00 PM",
      location: "Main Church",
      category: "Prayer",
      description: "Start the new year with prayer and fasting. Join us for a day of seeking God's guidance and blessing for the year ahead.",
      capacity: 50,
      registered: 23,
      featured: false,
      registration_required: true,
      registration_deadline: null
    },
    {
      id: 3,
      title: "DAMUTEENS 20'S",
      date: "2025-01-15",
      time: "Friday 6:00 PM - Sunday 3:00 PM",
      location: "Main Auditorium",
      category: "Youth",
      description: "A weekend of fun, fellowship, and spiritual growth for our youth. Activities include worship, games, workshops, and outdoor adventures.",
      capacity: 40,
      registered: 28,
      featured: false,
      registration_required: true,
      registration_deadline: null
    },
    {
      id: 4,
      title: "Couples fellowship programme",
      date: "2025-01-25",
      time: "9:00 AM - 4:00 PM",
      location: "Main Church",
      category: "Workshop",
      description: "Strengthen your marriage with practical tools and biblical principles. Includes lunch and childcare.",
      capacity: 30,
      registered: 18,
      featured: false,
      registration_required: true,
      registration_deadline: null
    },
    {
      id: 5,
      title: "BOB and JOB",
      date: "2025-02-01",
      time: "10:00 AM - 2:00 PM",
      location: "Church Parking Lot",
      category: "Outreach",
      description: "Help us serve our community by helping in house chores and community cleaning.",
      capacity: null,
      registered: 35,
      featured: false,
      registration_required: false,
      registration_deadline: null
    },
    {
      id: 6,
      title: "Weekly Fellowship",
      date: "2025-02-14",
      time: "6:00 PM - 9:00 PM",
      location: "Fellowship Hall",
      category: "Fellowship",
      description: "Celebrate in the presence of the Lord. Enjoy great music, prayer sessions, and fellowship with other members.",
      capacity: 60,
      registered: 42,
      featured: false,
      registration_required: false,
      registration_deadline: null
    }
  ];

  // Use fetched events if available, otherwise use default data
  const displayEvents = events.length > 0 ? events.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.start_time && event.end_time 
      ? `${new Date(`1970-01-01T${event.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(`1970-01-01T${event.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : event.start_time
      ? new Date(`1970-01-01T${event.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Time TBD',
    location: event.location,
    category: event.category,
    description: event.description,
    capacity: event.capacity,
    registered: 0, // Would need to count registrations
    featured: event.is_featured,
    registration_required: event.registration_required,
    registration_deadline: event.registration_deadline
  })) : defaultEvents;

  const categories = [
    { name: "All Events", value: "all", color: "bg-primary", icon: CalendarDays },
    { name: "Special Service", value: "Special Service", color: "bg-sanctuary", icon: Zap },
    { name: "Youth", value: "Youth", color: "bg-worship", icon: Baby },
    { name: "Workshop", value: "Workshop", color: "bg-blessing", icon: BookOpen },
    { name: "Outreach", value: "Outreach", color: "bg-secondary", icon: Globe },
    { name: "Fellowship", value: "Fellowship", color: "bg-accent", icon: Utensils },
    { name: "Prayer", value: "Prayer", color: "bg-muted", icon: Heart }
  ];

  const filteredEvents = selectedCategory === "all" 
    ? displayEvents 
    : displayEvents.filter(event => event.category === selectedCategory);

  const featuredEvent = displayEvents.find(event => event.featured);
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

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : CalendarDays;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${eventsHeader})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
              Upcoming Events
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
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

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="lg" 
                          className="sanctuary-gradient text-sanctuary-foreground hover:opacity-90"
                          onClick={() => setSelectedEvent(featuredEvent)}
                          disabled={!featuredEvent?.registration_required}
                        >
                          <Heart className="h-5 w-5 mr-2" />
                          {featuredEvent?.registration_required ? 'Register Now' : 'Learn More'}
                        </Button>
                      </DialogTrigger>
                      {featuredEvent?.registration_required && (
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Register for {featuredEvent.title}</DialogTitle>
                            <DialogDescription>
                              Fill out the form below to register for this event.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleEventRegistration} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                  id="firstName"
                                  value={registrationForm.firstName}
                                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, firstName: e.target.value }))}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                  id="lastName"
                                  value={registrationForm.lastName}
                                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, lastName: e.target.value }))}
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={registrationForm.email}
                                onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                type="tel"
                                value={registrationForm.phone}
                                onChange={(e) => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="specialNeeds">Special Needs/Accommodations</Label>
                              <Textarea
                                id="specialNeeds"
                                value={registrationForm.specialNeeds}
                                onChange={(e) => setRegistrationForm(prev => ({ ...prev, specialNeeds: e.target.value }))}
                                placeholder="Any special accommodations needed?"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                                <Input
                                  id="emergencyContact"
                                  value={registrationForm.emergencyContact}
                                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                                <Input
                                  id="emergencyPhone"
                                  type="tel"
                                  value={registrationForm.emergencyPhone}
                                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                                />
                              </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isRegistering}>
                              {isRegistering ? 'Registering...' : 'Complete Registration'}
                            </Button>
                          </form>
                        </DialogContent>
                      )}
                    </Dialog>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Calendar Navigation & Filter */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Calendar Widget */}
            <div className="w-full lg:w-auto">
              <h2 className="text-2xl font-playfair font-bold text-foreground mb-6">
                Select Date
              </h2>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-64 lg:w-80 justify-start text-left font-normal bg-card",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border shadow-lg z-50" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="p-3 pointer-events-auto bg-card"
                    />
                  </PopoverContent>
                </Popover>
                
                {selectedDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDate(undefined)}
                    className="w-full sm:w-auto lg:w-full"
                  >
                    Clear Date Filter
                  </Button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-1 w-full">
              <h2 className="text-2xl font-playfair font-bold text-foreground mb-6">
                Browse by Category
              </h2>
              
              {/* Mobile: Dropdown, Desktop: Grid */}
              <div className="block sm:hidden">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-card">
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const category = categories.find(c => c.value === selectedCategory);
                          const IconComponent = category?.icon || CalendarDays;
                          return (
                            <>
                              <IconComponent className="h-4 w-4" />
                              <span>{category?.name || "All Events"}</span>
                            </>
                          );
                        })()}
                      </div>
                      <ChevronLeft className="h-4 w-4 rotate-90" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-2 bg-card border shadow-lg z-50">
                    <div className="grid grid-cols-1 gap-1">
                      {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <Button
                            key={category.value}
                            variant={selectedCategory === category.value ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.value)}
                            className={cn(
                              "justify-start space-x-2",
                              selectedCategory === category.value ? `${category.color} text-white` : ""
                            )}
                          >
                            <IconComponent className="h-4 w-4" />
                            <span>{category.name}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Desktop: Grid Layout */}
              <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.value}
                      variant={selectedCategory === category.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.value)}
                      className={cn(
                        "flex flex-col items-center space-y-1 h-auto py-3 px-2",
                        selectedCategory === category.value ? `${category.color} text-white` : "hover:bg-accent/50"
                      )}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="text-xs text-center leading-tight">{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 || upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No events found in this category.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSelectedCategory("all")}
              >
                View All Events
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => {
                const IconComponent = getCategoryIcon(event.category);
                return (
                  <Card 
                    key={event.id} 
                    className="group hover:shadow-2xl hover:-translate-y-2 smooth-transition duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="relative overflow-hidden">
                      <div className={`h-32 ${getCategoryColor(event.category)} flex items-center justify-center text-white rounded-t-lg group-hover:scale-110 smooth-transition duration-500`}>
                        <div className="text-center relative z-10">
                          <IconComponent className="h-8 w-8 mx-auto mb-2 group-hover:scale-125 smooth-transition duration-300" />
                          <p className="text-sm font-medium">{event.category}</p>
                        </div>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 smooth-transition duration-300" />
                      </div>
                      
                      {/* Capacity indicator */}
                      {event.capacity && (
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                          {event.registered}/{event.capacity}
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary smooth-transition mb-2 line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 group-hover:text-foreground smooth-transition">
                          {event.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 group-hover:text-primary smooth-transition">
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
                            <div className="flex-1 bg-muted rounded-full h-2 ml-2">
                              <div 
                                className="bg-primary rounded-full h-2 smooth-transition group-hover:bg-sanctuary"
                                style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-2 space-y-2">
                        <Button 
                          size="sm" 
                          className="w-full group-hover:shadow-lg smooth-transition sanctuary-gradient text-sanctuary-foreground hover:opacity-90 transform group-hover:scale-105"
                        >
                          <Heart className="h-3 w-3 mr-2" />
                          Register Now
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full opacity-0 group-hover:opacity-100 smooth-transition"
                        >
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
            <div className="space-y-4">
              <SocialLinks variant="contact" size="md" className="justify-center" />
              <p className="text-sm text-muted-foreground">Follow us for updates</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
