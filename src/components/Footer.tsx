import { Heart, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="sanctuary-gradient text-sanctuary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-white/10">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-playfair font-bold">Heart of the Church</h3>
            </div>
            <p className="text-sanctuary-foreground/80 text-sm leading-relaxed">
              A welcoming community where faith grows, hearts are healed, and lives are transformed through God's love.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              {["About Us", "Sermons", "Events", "Ministries", "Prayer Requests"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sanctuary-foreground/80 hover:text-sanctuary-foreground smooth-transition text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-sanctuary-foreground/60" />
                <span className="text-sanctuary-foreground/80 text-sm">
                  123 Faith Street<br />
                  Grace City, GC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-sanctuary-foreground/60" />
                <span className="text-sanctuary-foreground/80 text-sm">(555) 123-PRAY</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-sanctuary-foreground/60" />
                <span className="text-sanctuary-foreground/80 text-sm">hello@heartchurch.org</span>
              </div>
            </div>
          </div>

          {/* Service Times & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Service Times</h4>
            <div className="space-y-2 text-sanctuary-foreground/80 text-sm">
              <div>Sunday Worship: 9:00 AM & 11:00 AM</div>
              <div>Wednesday Bible Study: 7:00 PM</div>
              <div>Youth Group: Friday 6:30 PM</div>
            </div>
            
            <div className="pt-4">
              <h5 className="text-sm font-medium mb-3">Follow Us</h5>
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/10">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/10">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-white/10">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sanctuary-foreground/20 text-center">
          <p className="text-sanctuary-foreground/60 text-sm">
            © 2024 Heart of the Church. All rights reserved. Built with ❤️ for our community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;