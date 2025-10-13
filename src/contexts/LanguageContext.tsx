import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'yo';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.sermons': 'Sermons',
    'nav.videos': 'Videos',
    'nav.gallery': 'Gallery',
    'nav.events': 'Events',
    'nav.ministries': 'Ministries',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.give': 'Give',
    'nav.tagline': 'Faith, hope & Love.',
    
    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.followUs': 'Follow Us',
    'footer.newsletter': 'Newsletter',
    'footer.newsletterText': 'Subscribe to our newsletter for updates',
    'footer.rights': 'All rights reserved.',
    
    // Common
    'common.readMore': 'Read More',
    'common.register': 'Register',
    'common.submit': 'Submit',
    'common.loading': 'Loading...',
    'common.viewAll': 'View All',
    
    // Homepage
    'home.welcomeHome': 'Welcome Home',
    'home.welcomeText': 'Where faith grows, hearts are healed, and lives are transformed through God\'s love and community.',
    'home.watchLive': 'Watch Live',
    'home.joinUsThisWeek': 'Join Us This Week',
    'home.joinUsText': 'Come as you are and experience the love of God in our welcoming community.',
    'home.sundayWorship': 'Sunday Worship',
    'home.englishService': 'English Service: 8:00AM - 10:00AM',
    'home.yorubaService': 'Yoruba Service: 10:00AM - 12:00PM',
    'home.bibleStudy': 'Bible Study',
    'home.bibleStudyTime': 'Wednesday 7:00 PM',
    'home.bibleStudyText': 'Deep dive into God\'s Word together',
    'home.youthGroup': 'Youth Group',
    'home.youthGroupTime': 'Friday 6:30 PM',
    'home.youthGroupText': 'Fun, faith, and fellowship for teens',
    'home.ourHeartMission': 'Our Heart & Mission',
    'home.missionText1': 'For over a few decades, Second ECWA has been a beacon of hope and love in our community. We believe in the transformative power of faith, the strength of community, and the importance of serving others with compassion and grace.',
    'home.missionText2': 'Whether you\'re seeking spiritual guidance, looking for a place to belong, or wanting to make a difference in the world, you\'ll find your home here with us.',
    'home.learnMore': 'Learn More About Us',
    'home.members': '500+ Members',
    'home.growingTogether': 'Growing in faith together',
    'home.getConnected': 'Get Connected',
    'home.getConnectedText': 'Explore ways to grow in faith and serve our community',
    'home.latestSermons': 'Latest Sermons',
    'home.latestSermonsText': 'Listen to recent messages and find inspiration',
    'home.upcomingEvents': 'Upcoming Events',
    'home.upcomingEventsText': 'Join us for special services and activities',
    'home.giveOnline': 'Give Online',
    'home.giveOnlineText': 'Support our mission and community outreach',
    'home.visitUs': 'Visit Us',
    'home.visitUsText': 'Find directions and plan your first visit',
    'home.thisWeekMessage': 'This Week\'s Message',
    'home.featuredSermonTitle': '"Walking in Faith, Not Fear"',
    'home.featuredSermonText': 'Join Samuel Oyegunle as he explores how faith can overcome our deepest fears and uncertainties. Discover the peace that comes from trusting in God\'s perfect plan for your life.',
    'home.scripture': 'Scripture',
    'home.scriptureRef': 'Isaiah 41:10',
    'home.date': 'Date',
    'home.sermonDate': 'May 15, 2025',
    'home.viewAllSermons': 'View All Sermons',
    'home.watchSermon': 'Watch Sermon',
  },
  yo: {
    // Navigation
    'nav.home': 'Ilé',
    'nav.about': 'Nípa Wa',
    'nav.sermons': 'Àwọn Ìwàásù',
    'nav.videos': 'Àwọn Fídíò',
    'nav.gallery': 'Àwòrán',
    'nav.events': 'Àwọn Ìṣẹ̀lẹ̀',
    'nav.ministries': 'Àwọn Iṣẹ́ Ìjọ',
    'nav.contact': 'Kàn Sí Wa',
    'nav.admin': 'Alábòjútó',
    'nav.give': 'Fún Wa',
    'nav.tagline': 'Ìgbàgbọ́, Ìrètí àti Ìfẹ́.',
    
    // Footer
    'footer.quickLinks': 'Àwọn Ọ̀nà Yára',
    'footer.contact': 'Kàn Sí Wa',
    'footer.followUs': 'Tẹ̀lé Wa',
    'footer.newsletter': 'Ìwé Ìròyìn',
    'footer.newsletterText': 'Forúkọ sílẹ̀ fún ìwé ìròyìn wa fún àwọn ìmúdójúíwọ̀n',
    'footer.rights': 'Gbogbo ẹ̀tọ́ ni a dáàbò bò.',
    
    // Common
    'common.readMore': 'Kà Síwájú',
    'common.register': 'Forúkọsílẹ̀',
    'common.submit': 'Fi Ránṣẹ́',
    'common.loading': 'Ń gbé...',
    'common.viewAll': 'Wo Gbogbo',
    
    // Homepage
    'home.welcomeHome': 'Káàbọ̀ Sílé',
    'home.welcomeText': 'Níbi tí ìgbàgbọ́ ti ń dàgbà, àwọn ọkàn ń wó sàn, àti àwọn ìgbésí ayé ti ń yí padà nípasẹ̀ ìfẹ́ Ọlọ́run àti àwùjọ.',
    'home.watchLive': 'Wòó Láyé',
    'home.joinUsThisWeek': 'Dara pọ̀ mọ́ Wa Lọ́sẹ̀ Yìí',
    'home.joinUsText': 'Wá bí o ṣe wà kí o sì ní ìrírí ìfẹ́ Ọlọ́run nínú àwùjọ àbò wa.',
    'home.sundayWorship': 'Ìjọ́sìn Ọjọ́ Àìkú',
    'home.englishService': 'Ìjọ́sìn Gẹ̀ẹ́sì: 8:00AM - 10:00AM',
    'home.yorubaService': 'Ìjọ́sìn Yorùbá: 10:00AM - 12:00PM',
    'home.bibleStudy': 'Ìkẹ́kọ̀ọ́ Bíbélì',
    'home.bibleStudyTime': 'Ọjọ́rú 7:00 PM',
    'home.bibleStudyText': 'Ìwádìí jíjìn sínú Ọ̀rọ̀ Ọlọ́run papọ̀',
    'home.youthGroup': 'Ẹgbẹ́ Ọ̀dọ́',
    'home.youthGroupTime': 'Ọjọ́ Ẹtì 6:30 PM',
    'home.youthGroupText': 'Ìgbádùn, ìgbàgbọ́, àti ìdàpọ̀ fún àwọn ọ̀dọ́',
    'home.ourHeartMission': 'Ọkàn àti Iṣẹ́ Àpinfunni Wa',
    'home.missionText1': 'Fún ọ̀pọ̀lọpọ̀ ọdún, Second ECWA ti jẹ́ ìmọ́lẹ̀ ìrètí àti ìfẹ́ nínú àwùjọ wa. A gbà pé agbára ìyípadà ti ìgbàgbọ́, agbára àwùjọ, àti pàtàkì ìsìn àwọn mìíràn pẹ̀lú àánú àti oore-ọ̀fẹ́.',
    'home.missionText2': 'Bóyá o ń wá ìtọ́sọ́nà ẹ̀mí, ń wá ibi tí o lè jẹ́ ti, tàbí fẹ́ṣe ìyàtọ̀ nínú ayé, ìwọ yóò rí ilé rẹ níhìn-ín pẹ̀lú wa.',
    'home.learnMore': 'Kọ́ Síi Nípa Wa',
    'home.members': '500+ Ọmọ Ẹgbẹ́',
    'home.growingTogether': 'Ń dàgbà nínú ìgbàgbọ́ papọ̀',
    'home.getConnected': 'Darapọ̀ Mọ́ Wa',
    'home.getConnectedText': 'Ṣàwárí àwọn ọ̀nà láti dàgbà nínú ìgbàgbọ́ àti sìn àwùjọ wa',
    'home.latestSermons': 'Àwọn Ìwàásù Tuntun',
    'home.latestSermonsText': 'Gbọ́ àwọn ìwàásù àìpẹ́ kí o sì rí ìmísí',
    'home.upcomingEvents': 'Àwọn Ìṣẹ̀lẹ̀ Tó Ń Bọ̀',
    'home.upcomingEventsText': 'Darapọ̀ mọ́ wa fún àwọn iṣẹ́ pàtàkì àti ìgbòkegbodò',
    'home.giveOnline': 'Fún Ní Orí Íńtánẹ́ẹ̀tì',
    'home.giveOnlineText': 'Ṣe àtìlẹ́yìn iṣẹ́ àpinfunni àti ìránṣẹ́ àwùjọ wa',
    'home.visitUs': 'Bẹ̀ Wá Wò',
    'home.visitUsText': 'Wá ọ̀nà àti gbèrò ìbẹ̀wò àkọ́kọ́ rẹ',
    'home.thisWeekMessage': 'Ìkìlọ̀ Ọ̀sẹ̀ Yìí',
    'home.featuredSermonTitle': '"Rìn Nínú Ìgbàgbọ́, Kì Í Ṣe Ẹ̀rù"',
    'home.featuredSermonText': 'Darapọ̀ mọ́ Samuel Oyegunle bí ó ṣe ń ṣàwárí bí ìgbàgbọ́ ṣe lè ṣẹ́gun àwọn ẹ̀rù wa tó jinlẹ̀ àti àìdánilójú. Ṣàwárí àlàáfíà tí ó ń wá láti gbẹ́kẹ̀lé ètò pípé Ọlọ́run fún ìgbésí ayé rẹ.',
    'home.scripture': 'Ìwé Mímọ́',
    'home.scriptureRef': 'Isaiah 41:10',
    'home.date': 'Ọjọ́',
    'home.sermonDate': 'May 15, 2025',
    'home.viewAllSermons': 'Wo Gbogbo Ìwàásù',
    'home.watchSermon': 'Wò Ìwàásù',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
