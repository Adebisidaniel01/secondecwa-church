import { CreditCard, Building, Users, Heart, Gift } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import giveHeader from "@/assets/community-prayer.jpg";

const Give = () => {
  const donationMethods = [
    {
      icon: Building,
      title: "Bank Transfer",
      description: "Direct bank transfer to our church account",
      details: [
        "Bank: First Bank of Nigeria",
        "Account Name: Second ECWA Church",
        "Account Number: 2034567890",
        "Sort Code: 011-023456"
      ]
    },
    {
      icon: CreditCard,
      title: "Online Donation",
      description: "Secure online giving via Paystack",
      details: [
        "Safe and secure transactions",
        "Instant confirmation",
        "Regular giving options available"
      ]
    }
  ];

  const givingOptions = [
    {
      icon: Heart,
      title: "Tithe",
      description: "Regular giving to support the church ministry",
      amount: "10% of income"
    },
    {
      icon: Gift,
      title: "Special Offering",
      description: "Support special projects and missions",
      amount: "Any amount"
    },
    {
      icon: Users,
      title: "Building Fund",
      description: "Help us expand our church facilities",
      amount: "Any amount"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${giveHeader})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
              Give with Purpose
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Your generosity helps us fulfill our mission of spreading God's love 
              and serving our community with compassion and care.
            </p>
          </div>
        </div>
      </section>

      {/* Scripture Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl md:text-3xl font-playfair italic text-foreground mb-4">
            "Each of you should give what you have decided in your heart to give, 
            not reluctantly or under compulsion, for God loves a cheerful giver."
          </blockquote>
          <cite className="text-lg text-primary font-medium">- 2 Corinthians 9:7</cite>
        </div>
      </section>

      {/* Giving Options */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
              Ways to Give
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the giving option that aligns with your heart and financial situation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {givingOptions.map((option, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg smooth-transition">
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-full sanctuary-gradient w-fit mx-auto">
                    <option.icon className="h-8 w-8 text-sanctuary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">{option.title}</h3>
                  <p className="text-muted-foreground">{option.description}</p>
                  <p className="text-primary font-medium">{option.amount}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Methods */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
              How to Give
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your preferred method to make your donation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {donationMethods.map((method, index) => (
              <Card key={index} className="p-8">
                <CardHeader className="text-center pb-6">
                  <div className="p-4 rounded-full sanctuary-gradient w-fit mx-auto mb-4">
                    <method.icon className="h-8 w-8 text-sanctuary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{method.title}</CardTitle>
                  <CardDescription className="text-lg">{method.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {method.details.map((detail, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-mono text-sm">{detail}</p>
                    </div>
                  ))}
                  {method.title === "Online Donation" && (
                    <Button 
                      className="w-full mt-6 sanctuary-gradient text-sanctuary-foreground hover:opacity-90"
                      size="lg"
                    >
                      Give Online (Coming Soon)
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
              Your Impact
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how your generous giving helps transform lives and strengthen our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="text-4xl font-playfair font-bold text-primary">500+</div>
                <h3 className="text-lg font-semibold">Lives Touched</h3>
                <p className="text-muted-foreground">Through our community outreach programs</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="text-4xl font-playfair font-bold text-primary">50+</div>
                <h3 className="text-lg font-semibold">Families Supported</h3>
                <p className="text-muted-foreground">With food, clothing, and assistance</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="text-4xl font-playfair font-bold text-primary">25+</div>
                <h3 className="text-lg font-semibold">Ministry Programs</h3>
                <p className="text-muted-foreground">Serving all ages in our community</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-playfair font-bold text-foreground mb-4">
            Questions About Giving?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Our finance team is here to help with any questions about giving or donations.
          </p>
          <div className="space-y-2">
            <p className="text-foreground">
              <strong>Email:</strong> finance@secondecwa.org
            </p>
            <p className="text-foreground">
              <strong>Phone:</strong> +234 (0) 123 456 7890
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Give;