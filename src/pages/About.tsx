import { Users, Globe, HandHeart, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import communityImage from "@/assets/community-prayer.jpg";
import reverendAyebulu from "@/assets/reverend-ayebulu.jpg";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Love",
      description: "We believe in the transformative power of God's unconditional love and strive to share it with everyone we meet."
    },
    {
      icon: Users,
      title: "Community",
      description: "We foster authentic relationships and create a welcoming space where everyone belongs and can grow together."
    },
    {
      icon: Globe,
      title: "Service",
      description: "We are called to serve our local community and beyond, making a positive impact in Jesus' name."
    },
    {
      icon: HandHeart,
      title: "Compassion",
      description: "We extend grace and mercy to all, offering support and care to those in need without judgment."
    }
  ];

  const leadership = [
    {
      name: "Reverend Dr. Ayebulu Emmanuel",
      role: "Senior Pastor",
      description: "Leading our congregation with wisdom and compassion for over 15 years.",
      photoUrl: reverendAyebulu
    },
    {
      name: "Reverend Oluwafemi Adeyemi",
      role: "Worship Director",
      description: "Inspiring hearts through music and creating meaningful worship experiences.",
      photoUrl: null
    },
    {
      name: "Pastor Samuel Oyegunle",
      role: "Youth Pastor",
      description: "Empowering the next generation to discover their purpose in Christ.",
      photoUrl: null
    },
    {
      name: "Pastor Alabi Malik ",
      role: "Teenagers Pastor",
      description: "Connecting our church with the community through service and love.",
      photoUrl: null
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6">
              About Second ECWA
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              For over two decades, we've been a place where faith flourishes, 
              community thrives, and lives are transformed by the love of Jesus Christ.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Second ECWA was founded in 1974 by a small group of missionaries who shared 
                  a vision of creating a church that would be the heart of the community. What started 
                  as frequent gatherings in a room has grown into a vibrant congregation of over 
                  500 members.
                </p>
                <p>
                  Throughout our history, we've remained committed to our founding principles: 
                  authentic worship, genuine community, and compassionate service. We believe that 
                  faith is not just a Sunday morning activity, but a way of life that transforms 
                  individuals, families, and communities.
                </p>
                <p>
                  Today, we continue to be a place where people from all walks of life can find 
                  hope, healing, and purpose. Whether you're taking your first steps in faith or 
                  have been walking with God for years, you'll find a home here with us.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src={communityImage} 
                alt="Church community" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -top-6 -right-6 p-6 bg-card rounded-xl shadow-lg border">
                <div className="text-center">
                  <p className="text-3xl font-playfair font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">Years of Ministry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8 church-shadow">
              <CardContent className="space-y-4">
                <h3 className="text-2xl font-playfair font-bold text-foreground">Our Mission</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To be the heart of our community by connecting people to God, to each other, 
                  and to their purpose through authentic worship, genuine relationships, and 
                  compassionate service.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 blessing-shadow">
              <CardContent className="space-y-4">
                <h3 className="text-2xl font-playfair font-bold text-foreground">Our Vision</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A community where every person experiences the transformative love of Jesus Christ 
                  and is empowered to make a positive impact in the world around them.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These values guide everything we do and shape the culture of our church community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg smooth-transition">
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-full sanctuary-gradient w-fit mx-auto">
                    <value.icon className="h-8 w-8 text-sanctuary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
              Our Leadership Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated leaders who serve our church community with passion and purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg smooth-transition">
                <CardContent className="space-y-4">
                  <div className="w-24 h-24 rounded-full mx-auto overflow-hidden">
                    {leader.photoUrl ? (
                      <img 
                        src={leader.photoUrl} 
                        alt={leader.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-2xl font-playfair font-bold text-white">
                          {leader.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{leader.name}</h3>
                    <p className="text-primary font-medium">{leader.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{leader.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statement of Faith */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
              What We Believe
            </h2>
            <p className="text-lg text-muted-foreground">
              Our faith is grounded in the timeless truths of Christianity
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-8">
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Bible</h3>
                  <p className="text-muted-foreground">
                    We believe the Bible is the inspired, authoritative Word of God and our guide for faith and living.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Jesus Christ</h3>
                  <p className="text-muted-foreground">
                    We believe Jesus Christ is the Son of God, who died for our sins and rose again, offering salvation to all who believe.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Holy Spirit</h3>
                  <p className="text-muted-foreground">
                    We believe the Holy Spirit guides, empowers, and transforms believers to live according to God's will.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Church</h3>
                  <p className="text-muted-foreground">
                    We believe the church is the body of Christ, called to worship God, fellowship together, and serve the world.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
