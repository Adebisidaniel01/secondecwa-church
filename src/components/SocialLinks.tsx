import { Facebook, Instagram, Youtube, Music } from "lucide-react";
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
      url: "https://web.facebook.com/secondecwa.ilorin",
      icon: Facebook,
      color: "text-[#1877F2]",
      hoverColor: "hover:text-[#1877F2]/80"
    },
    {
      name: "Instagram", 
      url: "https://www.instagram.com/secondecwa",
      icon: Instagram,
      color: "text-[#E4405F]",
      hoverColor: "hover:text-[#E4405F]/80"
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@secondecwailorin",
      icon: Youtube,
      color: "text-[#FF0000]",
      hoverColor: "hover:text-[#FF0000]/80"
    },
    {
      name: "TikTok",
      url: "https://vm.tiktok.com/ZSH3Nn6oju6Y8-AtgCZ/",
      icon: Music,
      color: "text-[#000000] dark:text-[#FFFFFF]",
      hoverColor: "hover:text-[#000000]/80 dark:hover:text-[#FFFFFF]/80"
    }
  ];

  const getButtonSize = () => {
    switch (size) {
      case "sm": return "h-10 w-10 p-0";
      case "lg": return "h-16 w-16 p-0";
      default: return "h-12 w-12 p-0";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm": return "h-5 w-5";
      case "lg": return "h-8 w-8";
      default: return "h-6 w-6";
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "header":
        return "hover:bg-accent/20 hover:scale-110 transition-all duration-300";
      case "contact":
        return "hover:bg-background/10 hover:scale-105 transition-all duration-300 border border-border/50";
      default: // footer
        return "hover:bg-background/10 hover:scale-110 transition-all duration-300";
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
            className={`group inline-flex items-center justify-center ${getButtonSize()} ${getVariantStyles()} rounded-md cursor-pointer relative z-10`}
            aria-label={`Follow us on ${social.name}`}
          >
            <Icon
              className={`${getIconSize()} transition-all duration-300 ${social.color} ${social.hoverColor} pointer-events-none`}
              strokeWidth={2.5}
            />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
