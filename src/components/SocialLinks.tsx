import { Facebook, Instagram, Youtube, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialLinksProps {
  variant?: "header" | "footer" | "contact";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SocialLinks = ({ variant = "footer", size = "md", className = "" }: SocialLinksProps) => {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://facebook.com/secondecwachurch",
      icon: Facebook,
      color: "hover:text-blue-500",
      bgColor: "hover:bg-blue-500/10"
    },
    {
      name: "Instagram", 
      url: "https://instagram.com/secondecwachurch",
      icon: Instagram,
      color: "hover:text-pink-500",
      bgColor: "hover:bg-pink-500/10"
    },
    {
      name: "YouTube",
      url: "https://youtube.com/@secondecwachurch",
      icon: Youtube,
      color: "hover:text-red-500",
      bgColor: "hover:bg-red-500/10"
    },
    {
      name: "Twitter",
      url: "https://twitter.com/secondecwachurch",
      icon: Twitter,
      color: "hover:text-sky-500",
      bgColor: "hover:bg-sky-500/10"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/secondecwachurch",
      icon: Linkedin,
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-600/10"
    }
  ];

  const getButtonSize = () => {
    switch (size) {
      case "sm": return "h-8 w-8 p-0";
      case "lg": return "h-12 w-12 p-0";
      default: return "h-10 w-10 p-0";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm": return "h-3 w-3";
      case "lg": return "h-5 w-5";
      default: return "h-4 w-4";
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "header":
        return "hover:bg-accent hover:scale-110 transition-all duration-300";
      case "contact":
        return "hover:bg-primary/10 hover:scale-105 transition-all duration-300 border border-border/50";
      default: // footer
        return "hover:bg-white/20 hover:scale-110 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-white/20";
    }
  };

  return (
    <div className={`flex space-x-3 ${className}`}>
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            aria-label={`Follow us on ${social.name}`}
          >
            <Button
              variant="ghost"
              size="sm"
              className={`${getButtonSize()} ${getVariantStyles()}`}
            >
              <Icon className={`${getIconSize()} transition-all duration-300 ${variant === "footer" ? "group-hover:text-white" : social.color}`} />
            </Button>
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;