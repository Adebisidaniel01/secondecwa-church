import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SocialLinks from "@/components/SocialLinks";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubmittingPrayer, setIsSubmittingPrayer] = useState(false);
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [prayerForm, setPrayerForm] = useState({
    name: '',
    email: '',
    phone: '',
    request: '',
    isUrgent: false,
    isConfidential: false
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    try {
      const { error } = await supabase.functions.invoke('contact-form', {
        body: contactForm
      });

      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });

      setContactForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handlePrayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPrayer(true);

    try {
      const { error } = await supabase.functions.invoke('prayer-request', {
        body: prayerForm
      });

      if (error) throw error;

      toast({
        title: "Prayer request submitted!",
        description: "Our prayer team will lift you up in prayer.",
      });

      setPrayerForm({
        name: '',
        email: '',
        phone: '',
        request: '',
        isUrgent: false,
        isConfidential: false
      });
    } catch (error) {
      console.error('Error submitting prayer request:', error);
      toast({
        title: "Error submitting prayer request",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingPrayer(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: ["20 Micheal Ibru, Amilegbe Rd, Oko Erin"],
      link: "https://www.google.com/maps/dir//20+Micheal+Ibru,+Amilegbe+Rd,+Oko+Erin/@8.4948171,4.4830178,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x1036535990572d5f:0x6c82c3c0ecc8972f!2m2!1d4.5654197!2d8.4948171"
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+2348161679998", "+2348033584401", "+2347034205477"],
      link: null // Phone numbers are handled as tel: links
    },
    {
      icon: Mail,
      title: "Email",
      details: ["ecwa2@yahoo.com"],
      link: "mailto:ecwa2@yahoo.com"
    },
    {
      icon: Clock,
      title: "Open Hours",
      details: ["Monday - Friday: 9:00 AM - 5:00 PM", "Saturday: 10:00 AM - 2:00 PM"],
      link: null
    }
  ];

  const serviceSchedule = [
    {
      day: "Sunday",
      services: [
        { name: "Morning Service", time: "8:00 AM - 10:00AM", type: "Worship Service" },
        { name: "Sunday School", time: "10:00AM-11:00 AM", type: "Class" },
        { name: "Baptismal Class", time: "3:00 PM", type: "Class" },
        { name: "House Fellowship", time: "5:00 PM - 6:00PM", type: "Fellowship" },
      ]
    },
    {
      day: "Monday",
      services: [
        { name: "Men Fellowship", time: "5:00PM", type: "Fellowship" },
        { name: "Women Fellowship", time: "5:00PM", type: "Fellowship" },
      ]
    },
    {
      day: "Tuesday",
      services: [
        { name: "Gospel Team", time: "5:00PM", type: "Team Meeting" }
      ]
    },
    {
      day: "Wednesday",
      services: [
        { name: "Bible Study", time: "5:00 PM - 6:00PM", type: "All Ages" },
        { name: "Board of Elders meeting", time: "6:00PM", type: "Meeting" }
      ]
    },
    {
      day: "Thursday",
      services: [
        { name: "Hour of prayer", time: "5:00PM-6:00 PM", type: "Prayer" },
        { name: "Sunday school preparatory class", time: "6:00-7:00 PM", type: "Class" }
      ]
    },
    {
      day: "Friday",
      services: [
        { name: "Youth Fellowship Meeting", time: "5:00 PM", type: "Fellowship" },
      ]
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We'd love to hear from you! Whether you have questions, need prayer,
              or want to get involved, we're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg smooth-transition">
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-full sanctuary-gradient w-fit mx-auto">
                    <info.icon className="h-8 w-8 text-sanctuary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-muted-foreground text-sm">
                        {info.title === "Phone" ? (
                          <a href={`tel:${detail}`} className="hover:text-primary smooth-transition">
                            {detail}
                          </a>
                        ) : info.link && idx === 0 ? (
                          <a
                            href={info.link}
                            className="hover:text-primary smooth-transition"
                            target={info.link.startsWith('http') ? '_blank' : undefined}
                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {detail}
                          </a>
                        ) : (
                          detail
                        )}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Schedule */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
              Service Schedule
            </h2>
            <p className="text-lg text-muted-foreground">
              Join us for worship and fellowship throughout the week
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceSchedule.map((schedule, index) => (
              <Card key={index} className="p-6 church-shadow">
                <CardContent className="space-y-4">
                  <h3 className="text-xl font-semibold text-center">{schedule.day}</h3>
                  <div className="space-y-3">
                    {schedule.services.map((service, idx) => (
                      <div key={idx} className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium">{service.name}</p>
                        <p className="text-lg font-playfair font-bold text-primary">{service.time}</p>
                        <p className="text-sm text-muted-foreground">{service.type}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-playfair font-bold text-foreground mb-6">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-8">
                Have a question or prayer request? We'd love to hear from you.
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={contactForm.firstName}
                      onChange={(e) => setContactForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Your first name" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={contactForm.lastName}
                      onChange={(e) => setContactForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Your last name" 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(234) 1234567890" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="What's this about?" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell us how we can help you..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full worship-gradient text-worship-foreground hover:opacity-90"
                  disabled={isSubmittingContact}
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isSubmittingContact ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Map */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-foreground mb-4">
                  Find Us
                </h2>
              </div>

              <div className="h-96 bg-muted rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.879749761366!2d4.5654197!3d8.4948171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1036535990572d5f%3A0x6c82c3c0ecc8972f!2s20%20Micheal%20Ibru%2C%20Amilegbe%20Rd%2C%20Oko%20Erin!5e0!3m2!1sen!2sng!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Second ECWA Church Location"
                />
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-muted-foreground mb-2">
                  Can't see the map? 
                  <a 
                    href="https://www.google.com/maps/dir//20+Micheal+Ibru,+Amilegbe+Rd,+Oko+Erin/@8.4948171,4.4830178,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x1036535990572d5f:0x6c82c3c0ecc8972f!2m2!1d4.5654197!2d8.4948171" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 smooth-transition ml-1"
                  >
                    Open in Google Maps
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prayer Request Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6">
            Need Prayer?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our prayer team is here for you. Submit a confidential prayer request
            and know that our community is lifting you up in prayer.
          </p>
          <div className="space-y-6">
            <form onSubmit={handlePrayerSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="prayerName">Name</Label>
                <Input 
                  id="prayerName"
                  value={prayerForm.name}
                  onChange={(e) => setPrayerForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prayerEmail">Email (Optional)</Label>
                  <Input 
                    id="prayerEmail"
                    type="email"
                    value={prayerForm.email}
                    onChange={(e) => setPrayerForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prayerPhone">Phone (Optional)</Label>
                  <Input 
                    id="prayerPhone"
                    type="tel"
                    value={prayerForm.phone}
                    onChange={(e) => setPrayerForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(234) 1234567890"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prayerRequest">Prayer Request</Label>
                <Textarea
                  id="prayerRequest"
                  value={prayerForm.request}
                  onChange={(e) => setPrayerForm(prev => ({ ...prev, request: e.target.value }))}
                  placeholder="How can we pray for you?"
                  className="min-h-[100px]"
                  required
                />
              </div>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={prayerForm.isUrgent}
                    onChange={(e) => setPrayerForm(prev => ({ ...prev, isUrgent: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Urgent</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={prayerForm.isConfidential}
                    onChange={(e) => setPrayerForm(prev => ({ ...prev, isConfidential: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Confidential</span>
                </label>
              </div>
              <Button 
                type="submit"
                size="lg" 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                disabled={isSubmittingPrayer}
              >
                {isSubmittingPrayer ? 'Submitting...' : 'Submit Prayer Request'}
              </Button>
            </form>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Connect With Us</h3>
              <p className="text-muted-foreground text-sm">
                Follow us on social media to stay updated with our latest events, sermons, and community activities.
              </p>
              <SocialLinks variant="contact" size="lg" className="justify-center" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
