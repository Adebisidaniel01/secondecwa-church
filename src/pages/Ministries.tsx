import { useState, useEffect } from "react";
import { Users, Heart, BookOpen, Music, Utensils, Globe, Baby, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";

const Ministries = () => {
  const { toast } = useToast();
  const [ministries, setMinistries] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVolunteering, setIsVolunteering] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<any>(null);
  const [volunteerForm, setVolunteerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  useEffect(() => {
    fetchMinistriesAndActivities();
  }, []);

  const fetchMinistriesAndActivities = async () => {
    try {
      const [ministriesResponse, activitiesResponse] = await Promise.all([
        supabase
          .from('ministries')
          .select('*')
          .eq('is_active', true)
          .order('name'),
        supabase
          .from('ministry_activities')
          .select('*, ministries(name)')
      ]);

      if (ministriesResponse.error) throw ministriesResponse.error;
      if (activitiesResponse.error) throw activitiesResponse.error;

      setMinistries(ministriesResponse.data || []);
      setActivities(activitiesResponse.data || []);
    } catch (error) {
      console.error('Error fetching ministries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMinistry) return;

    setIsVolunteering(true);

    try {
      const { error } = await supabase.functions.invoke('ministry-volunteer', {
        body: {
          ministryId: selectedMinistry.id,
          ...volunteerForm
        }
      });

      if (error) throw error;

      toast({
        title: "Volunteer registration successful!",
        description: `Thank you for volunteering with ${selectedMinistry.name}.`,
      });

      setVolunteerForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        emergencyContact: '',
        emergencyPhone: ''
      });
      setSelectedMinistry(null);
    } catch (error: any) {
      console.error('Error registering volunteer:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsVolunteering(false);
    }
  };

  const defaultMinistries = [
    {
      id: 1,
      name: "Youth Ministry",
      description: "Empowering teenagers to discover their identity in Christ through fun activities, deep conversations, and meaningful service opportunities.",
      icon: Users,
      ageGroup: "Ages 13-18",
      meetingTime: "Fridays 6:30 PM",
      location: "Teenagers Chapel",
      leader: "Pastor Alabi Malik",
      contact: "ecwa2ilorin@yahoo.com",
      activities: ["Youth Group", "IDYC Camp", "Mission Trips", "Games"],
      featured: true
    },
    {
      id: 2,
      name: "Children's Ministry",
      description: "Creating a safe and fun environment where children can learn about God's love through age-appropriate lessons, crafts, and activities.",
      icon: Baby,
      ageGroup: "Ages 3-12",
      meetingTime: "Sundays during service",
      location: "Children's Section",
      leader: "Miss Damilola, Mr. Gbenga",
      contact: "ecwa2ilorin@yahoo.com",
      activities: ["Sunday School", "Children's Choir"],
      featured: false
    },
    {
      id: 3,
      name: "Worship Ministry",
      description: "Leading our congregation in heartfelt worship through music, vocals, and technical support, creating an atmosphere for encountering God.",
      icon: Music,
      ageGroup: "All Ages",
      meetingTime: "Sundays & Wednesdays",
      location: "Main Sanctuary",
      leader: "SEES Choir",
      contact: "ecwa2ilorin@yahoo.com",
      activities: ["Choir", "Praise Band", "Sound Team", "Media Team"],
      featured: false
    },
    {
      id: 4,
      name: "Community Outreach",
      description: "Serving our local community with compassion and practical assistance, demonstrating God's love through action and service.",
      icon: Heart,
      ageGroup: "All Ages",
      meetingTime: "Various",
      location: "Community",
      leader: "Second ECWA youths",
      contact: "ecwa2ilorin@yahoo.com",
      activities: ["Homeless Ministry", "Prison Ministry", "Senior Care"],
      featured: false
    },
    
    {
      id: 5,
      name: "Women's Ministry",
      description: "Building strong friendships and spiritual connections among women through Bible study, fellowship events, and service projects.",
      icon: Heart,
      ageGroup: "Women 18+",
      meetingTime: "Monday 5:00 PM",
      location: "Main Church",
      leader: "Women fellowship committee",
      contact: "ecwa2ilorin@yahoo.com",
      activities: ["Bible Study", "Retreats", "Service Projects", "Fellowship"],
      featured: false
    },
    {
      id: 6,
      name: "Men's Ministry",
      description: "Encouraging men to grow in their faith, build meaningful relationships, and become strong spiritual leaders in their families and community.",
      icon: Users,
      ageGroup: "Men 18+",
      meetingTime: "Monday 5:00PM",
      location: "Main Church",
      leader: "Men's fellowship committee",
      contact: "ecwa2@yahoo.com",
      activities: ["Bible Study", "Men's Breakfast", "Service Projects", "Sports"],
      featured: false
    },
    {
      id: 7,
      name: "Prison Ministry",
      description: "Creating a welcoming atmosphere for all who enter our church doors, ensuring everyone feels valued and cared for.",
      icon: Heart,
      ageGroup: "All Ages",
      meetingTime: "As needed",
      location: "Various",
      leader: "Prison Outreach team",
      contact: "ecwa2ilorin@yahoo.com",
      activities: ["Greeters", "Gospel Ministry", "Event Catering", "Worship Team"],
      featured: false
    }
  ];

  // Use fetched ministries if available, otherwise use default data
  const displayMinistries = ministries.length > 0 ? ministries.map(ministry => ({
    ...ministry,
    activities: activities
      .filter(activity => activity.ministry_id === ministry.id)
      .map(activity => activity.activity_name),
    icon: getMinistryIcon(ministry.category)
  })) : defaultMinistries;

  const featuredMinistry = displayMinistries.find(ministry => ministry.is_featured || ministry.featured);
  const otherMinistries = displayMinistries.filter(ministry => !(ministry.is_featured || ministry.featured));

  const getMinistryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'youth': return Users;
      case 'children': return Baby;
      case 'worship': return Music;
      case 'outreach': return Globe;
      case 'fellowship': return Heart;
      default: return Users;
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6">
              Our Ministries
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Discover ways to grow in faith, build community, and serve others. 
              There's a place for everyone to belong and make a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Ministry */}
      {featuredMinistry && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
                Featured Ministry
              </h2>
              <p className="text-lg text-muted-foreground">
                Get involved and make a meaningful impact
              </p>
            </div>

            <Card className="overflow-hidden church-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative">
                  <div className="h-64 lg:h-full worship-gradient flex items-center justify-center text-worship-foreground">
                    <div className="text-center">
                      <featuredMinistry.icon className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-playfair font-bold">{featuredMinistry.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-8 lg:p-12">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-playfair font-bold text-foreground mb-4">
                        {featuredMinistry.name}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {featuredMinistry.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong className="text-foreground">Age Group:</strong>
                        <p className="text-muted-foreground">{featuredMinistry.ageGroup}</p>
                      </div>
                      <div>
                        <strong className="text-foreground">Meeting Time:</strong>
                        <p className="text-muted-foreground">{featuredMinistry.meetingTime}</p>
                      </div>
                      <div>
                        <strong className="text-foreground">Location:</strong>
                        <p className="text-muted-foreground">{featuredMinistry.location}</p>
                      </div>
                      <div>
                        <strong className="text-foreground">Leader:</strong>
                        <p className="text-muted-foreground">{featuredMinistry.leader}</p>
                      </div>
                    </div>

                    <div>
                      <strong className="text-foreground block mb-2">Activities:</strong>
                      <div className="flex flex-wrap gap-2">
                        {featuredMinistry.activities.map((activity, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="lg" 
                            className="sanctuary-gradient text-sanctuary-foreground hover:opacity-90"
                            onClick={() => setSelectedMinistry(featuredMinistry)}
                          >
                            Get Involved
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Volunteer for {featuredMinistry?.name}</DialogTitle>
                            <DialogDescription>
                              Fill out the form below to volunteer with this ministry.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                  id="firstName"
                                  value={volunteerForm.firstName}
                                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, firstName: e.target.value }))}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                  id="lastName"
                                  value={volunteerForm.lastName}
                                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, lastName: e.target.value }))}
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={volunteerForm.email}
                                onChange={(e) => setVolunteerForm(prev => ({ ...prev, email: e.target.value }))}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                type="tel"
                                value={volunteerForm.phone}
                                onChange={(e) => setVolunteerForm(prev => ({ ...prev, phone: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="position">Preferred Position/Role</Label>
                              <Input
                                id="position"
                                value={volunteerForm.position}
                                onChange={(e) => setVolunteerForm(prev => ({ ...prev, position: e.target.value }))}
                                placeholder="e.g., Team Member, Assistant, etc."
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                                <Input
                                  id="emergencyContact"
                                  value={volunteerForm.emergencyContact}
                                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                                <Input
                                  id="emergencyPhone"
                                  type="tel"
                                  value={volunteerForm.emergencyPhone}
                                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                                />
                              </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isVolunteering}>
                              {isVolunteering ? 'Submitting...' : 'Submit Volunteer Application'}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button size="lg" variant="outline">
                        Contact Leader
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* All Ministries Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
              All Ministries
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From children to seniors, from worship to outreach, find where you can 
              serve and grow in your faith journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherMinistries.map((ministry) => (
              <Card key={ministry.id} className="group hover:shadow-lg smooth-transition">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="p-4 rounded-full sanctuary-gradient w-fit mx-auto mb-4">
                      <ministry.icon className="h-8 w-8 text-sanctuary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary smooth-transition">
                      {ministry.name}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {ministry.description}
                  </p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">Age Group:</span>
                      <span className="text-muted-foreground">{ministry.ageGroup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">Meets:</span>
                      <span className="text-muted-foreground">{ministry.meetingTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">Leader:</span>
                      <span className="text-muted-foreground">{ministry.leader}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex flex-wrap gap-1 mb-4">
                      {ministry.activities.slice(0, 3).map((activity, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                        >
                          {activity}
                        </span>
                      ))}
                      {ministry.activities.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                          +{ministry.activities.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setSelectedMinistry(ministry)}
                        >
                          Volunteer
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Opportunities */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6">
                Leadership Opportunities
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                God has given each of us unique gifts and talents to serve His kingdom. 
                We believe that leadership is not about titles or positions, but about 
                serving others with love and humility.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Whether you're interested in teaching, organizing events, leading worship, 
                or serving in any other capacity, we'd love to help you discover your 
                calling and equip you for ministry.
              </p>
              <Button size="lg" className="blessing-gradient text-blessing-foreground hover:opacity-90">
                <GraduationCap className="h-5 w-5 mr-2" />
                Explore Leadership
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6 worship-shadow">
                <CardContent className="space-y-3">
                  <Users className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="font-semibold">Team Leaders</h3>
                  <p className="text-sm text-muted-foreground">Guide ministry teams with vision and care</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 blessing-shadow">
                <CardContent className="space-y-3">
                  <BookOpen className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="font-semibold">Teachers</h3>
                  <p className="text-sm text-muted-foreground">Share God's Word with passion and clarity</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 church-shadow">
                <CardContent className="space-y-3">
                  <Heart className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="font-semibold">Coordinators</h3>
                  <p className="text-sm text-muted-foreground">Organize events and programs with excellence</p>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 worship-shadow">
                <CardContent className="space-y-3">
                  <Globe className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="font-semibold">Outreach Leaders</h3>
                  <p className="text-sm text-muted-foreground">Extend God's love to the community</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6">
            Ready to Get Involved?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We believe everyone has something unique to contribute. Whether you have 
            five minutes or five hours a week, there's a place for you to serve and grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="worship-gradient text-worship-foreground hover:opacity-90">
              Find Your Ministry
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Talk to a Pastor
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Ministries;
