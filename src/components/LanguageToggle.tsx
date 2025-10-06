import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'yo' : 'en')}
      className="flex items-center gap-2"
      aria-label="Toggle language"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium">
        {language === 'en' ? 'Yorùbá' : 'English'}
      </span>
    </Button>
  );
};

export default LanguageToggle;
