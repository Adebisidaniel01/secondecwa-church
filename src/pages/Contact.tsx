import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: ["20 Micheal Ibru, Amilegbe Rd, Oko Erin"],
      link: "https://www.google.com/maps/dir//20+Micheal+Ibru,+Amilegbe+Rd,+Oko+Erin/@8.4948171,4.4830178,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x1036535990572d5f:0x6c82c3c0ecc8972f!2m2!1d4.5654197!2d8.4948257?entry=ttu&g_ep=EgoyMDI1MDcxNi4wIKXMDSoASAFQAw%3D%3D"
    },
    {
      icon: Phone,
      title: "Phone",
      details: [Call],
      link: "tel:+2348161679998, +2348033584401, +2347034205477"
    },
    {
      icon: Mail,
      title: "Email",
      details: [""],
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
        { name: "Sunday School", time: "10:00AM-11:00 AM",  },
        { name: "Baptismal Class", time: "3:00 PM", }
        { name: "House Fellowship", time: "5:00 PM - 6:00PM", }
      ]
    },
        {
      day: "Monday",
      services: [
        { name: "Men Fellowship", time: "5:00PM",},
        { name: "Women Fellowship", time: "5:00PM",  }
      ]
    },
    {
      day: "Tuesday",
      services: [
        { name: "Gospel Team", time: "5:00PM"}
        ]
    }
    {
      day: "Wednesday",
      services: [ 
        { name: "Bible Study", time: "5:00 PM - 6:00PM", type: "All Ages" }
        { name: "Board of Elders meeting", time: "6:00PM"}
      ]
    },
      {
      day: "Thursday",
      services: [
        { name: "Hour of prayer", time: "5:00PM-6:00 PM",}
         { name: "Sunday school preparatory class", time: "6:00-7:00 PM",}
      ]
    }
  ]
    {
      day: "Friday",
      services: [
        { name: "Youth Fellowship Meeting", time: "5:00 PM", }
      ]
    }
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
                        {info.link && idx === 0 ? (
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
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Your last name" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input id="phone" type="tel" placeholder="(234) 1234567890 " />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us how we can help you..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button size="lg" className="w-full worship-gradient text-worship-foreground hover:opacity-90">
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
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
              
              <div className="relative h-96 bg-muted rounded-2xl overflow-hidden">
                {https://www.google.com/maps/dir//20+Micheal+Ibru,+Amilegbe+Rd,+Oko+Erin/@8.4948171,4.4830178,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x1036535990572d5f:0x6c82c3c0ecc8972f!2m2!1d4.5654197!2d8.4948257?entry=ttu&g_ep=EgoyMDI1MDcxNi4wIKXMDSoASAFQAw%3D%3D}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                    <p className="text-muted-foreground">
                      Click to view in Google Maps
                    </p>
                  </div>
                </div>
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
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Submit Prayer Request
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
