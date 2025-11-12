import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SocialLinks from "@/components/SocialLinks";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import churchLogo from "@/assets/church-logo.jpg";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.about'), path: "/about" },
    { name: t('nav.sermons'), path: "/sermons" },
    { name: t('nav.videos'), path: "/videos" },
    { name: t('nav.events'), path: "/events" },
    { name: t('nav.ministries'), path: "/ministries" },
    { name: t('nav.contact'), path: "/contact" },
    { name: "Admin", path: "/admin" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <img 
              src={churchLogo} 
              alt="Second ECWA Church Logo" 
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <h1 className="text-xs sm:text-xl font-playfair font-bold text-foreground group-hover:text-primary smooth-transition leading-tight truncate">
                Second ECWA Church 
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{t('nav.tagline')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "px-2 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium smooth-transition whitespace-nowrap",
                  isActive(item.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-2 lg:gap-3 ml-2 lg:ml-4">
              <LanguageToggle />
              <ThemeToggle />
              <Link to="/give">
                <Button variant="default" size="sm" className="sanctuary-gradient text-sanctuary-foreground hover:opacity-90 whitespace-nowrap">
                  <Heart className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                  <span className="text-xs lg:text-sm">{t('nav.give')}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border mt-2">
            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium smooth-transition",
                    isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mx-4 mt-4 space-y-4">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
