import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="smooth-transition text-xs"
      >
        EN
      </Button>
      <Button
        variant={language === "yo" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("yo")}
        className="smooth-transition text-xs"
      >
        YO
      </Button>
    </div>
  );
};

export default LanguageToggle;
