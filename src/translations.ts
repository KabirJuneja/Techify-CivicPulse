import { Language } from './types';

export interface TranslationDictionary {
  navbar: {
    about: string;
    howItWorks: string;
    features: string;
    cityPulse: string;
    login: string;
    join: string;
  };
  hero: {
    badge: string;
    heading1: string;
    heading2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    noAadhaar: string;
    sla: string;
    liveSync: string;
    liveLocation: string;
  };
  features: {
    eyebrow: string;
    heading: string;
    f1Title: string;
    f1Desc: string;
    f1Link: string;
    f2Title: string;
    f2Desc: string;
    f2Link: string;
    f3Title: string;
    f3Desc: string;
    f3Link: string;
  };
  howItWorks: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    s1Title: string;
    s1Desc: string;
    s1Link: string;
    s2Title: string;
    s2Desc: string;
    s2Link: string;
    s3Title: string;
    s3Desc: string;
    s3Link: string;
    s4Title: string;
    s4Desc: string;
    s4Link: string;
  };
  pulse: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    stat1Title: string;
    stat1Desc: string;
    stat2Title: string;
    stat2Desc: string;
    stat3Title: string;
    stat3Desc: string;
  };
  grassroots: {
    eyebrow: string;
    heading: string;
    viewAll: string;
    badge: string;
    location: string;
    title: string;
    desc: string;
    volunteers: string;
    timeLabel: string;
    timeValue: string;
    rsvpBtn: string;
    shareBtn: string;
  };
  voices: {
    eyebrow: string;
    heading: string;
    t1Quote: string;
    t1Translation: string;
    t1Author: string;
    t1Role: string;
    t2Quote: string;
    t2Translation: string;
    t2Author: string;
    t2Role: string;
    t3Quote: string;
    t3Translation: string;
    t3Author: string;
    t3Role: string;
  };
  cta: {
    eyebrow: string;
    heading: string;
    desc: string;
    btnPrimary: string;
    btnSecondary: string;
  };
  footer: {
    langLabel: string;
    tollFree: string;
    seniorHelp: string;
    desc: string;
    linkAbout: string;
    linkAccess: string;
    linkPrivacy: string;
    linkRecords: string;
    copyright: string;
    gridStatus: string;
  };
  dashboard: {
    backToHome: string;
    headerHome: string;
    publicPortal: string;
    searchPlaceholder: string;
    reportIssueBtn: string;
    communityFeed: string;
    homeFeed: string;
    explore: string;
    nearby: string;
    cityServices: string;
    wardMap: string;
    myReports: string;
    communities: string;
    events: string;
    transparencyAudit: string;
    authorityPortals: string;
    amcWardDesk: string;
    highAuthority: string;
    forYou: string;
    following: string;
    nearbyWards: string;
    postPlaceholder: string;
    postBtn: string;
    civicScore: string;
    level3: string;
    reported: string;
    resolved: string;
    upvotes: string;
    activeInspector: string;
    trendingIssues: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    navbar: {
      about: "About",
      howItWorks: "How It Works",
      features: "Features",
      cityPulse: "City Pulse",
      login: "Login",
      join: "Join NAGAR-X"
    },
    hero: {
      badge: "Official Civic Bridge for Citizens & AMC",
      heading1: "YOUR CITY.",
      heading2: "YOUR COMMUNITY.",
      subtitle: "Connect with your neighborhood, report local issues in 30 seconds, and work together for a cleaner, safer Ahmedabad.",
      ctaPrimary: "Join NAGAR-X (Free) →",
      ctaSecondary: "Explore City Map 🧭",
      noAadhaar: "No Aadhaar Required to Browse",
      sla: "Average AMC Action: 48 Hrs",
      liveSync: "Live Sync",
      liveLocation: "Bodakdev, Ward 8 • 2 New Potholes Repaired Today"
    },
    features: {
      eyebrow: "CIVIC POWER MADE EASY",
      heading: "Simple tools built for every Amdavadi",
      f1Title: "Report Problems in 30s",
      f1Desc: "Notice a broken streetlight, open pothole, or uncleared waste pile? Take a photo, tag location, and AMC receives an automated geo-tagged ticket instantly.",
      f1Link: "Instant GPS & Ward Auto-detect",
      f2Title: "Connect with Neighbors",
      f2Desc: "Join hyper-local neighborhood committees, organize weekend cleanups, tree-plantation drives, and exchange safety updates with verified residents next door.",
      f2Link: "Verified Society Communities",
      f3Title: "Transparent AMC Updates",
      f3Desc: "No endless following up. Watch live status shifts as AMC field engineers acknowledge, dispatch, fix, and post photographic proof of resolution.",
      f3Link: "Public Inspection Dashboard"
    },
    howItWorks: {
      eyebrow: "EFFORTLESS RESOLUTION",
      heading: "How NAGAR-X Works in 4 Steps",
      subtitle: "Designed with zero learning curve so everyone—from college students to seniors—can participate without hassle.",
      s1Title: "1. Spot It",
      s1Desc: "Come across overflowing public garbage bins, broken water lines, or hazardous electric wires in your lane.",
      s1Link: "Real-time geo locator",
      s2Title: "2. Snap & Post",
      s2Desc: "Click a fast photo on your phone or dictate voice notes in Gujarati or Hindi. No complicated municipal paperwork.",
      s2Link: "Voice reporting supported",
      s3Title: "3. AMC Action",
      s3Desc: "The issue is automatically assigned to the designated AMC Ward Officer. Status updates send SMS alerts to you.",
      s3Link: "Tracked turnaround SLA",
      s4Title: "4. Verified Fix",
      s4Desc: "The department uploads a resolution photo. You and fellow community neighbors confirm the fix before closing.",
      s4Link: "Citizen audit verified"
    },
    pulse: {
      eyebrow: "PUBLIC PULSE",
      heading: "Measurable change on every street.",
      subtitle: "All ticket stats are publicly audit-able under open civic data transparency standards.",
      stat1Title: "1,420+",
      stat1Desc: "Resolved Issues • This month alone across civic wards",
      stat2Title: "48 / 48",
      stat2Desc: "AMC Wards • 100% covered with active ward inspectors",
      stat3Title: "64,000+",
      stat3Desc: "Active Citizens • Building community pride daily"
    },
    grassroots: {
      eyebrow: "GRASSROOTS SPOTLIGHT",
      heading: "Featured Neighborhood Initiative",
      viewAll: "View all ward events →",
      badge: "Official Community Drive",
      location: "Sabarmati Riverfront Promenade, West Zone",
      title: "Sabarmati Riverfront Green & Clean Drive",
      desc: "A collaborative citizen effort alongside SEWA youth volunteers and municipal sanitation teams to plant 1,200 native saplings and install smart micro-composting units.",
      volunteers: "Volunteers Registered",
      timeLabel: "This Saturday",
      timeValue: "07:00 AM - 10:30 AM",
      rsvpBtn: "RSVP to Join Drive",
      shareBtn: "Share with Society"
    },
    voices: {
      eyebrow: "VOICES OF AHMEDABAD",
      heading: "Simple enough for everyone in the family",
      t1Quote: "“હું 68 વર્ષનો છું. અમારી સોસાયટી બહાર ૨ મહિનાથી સ્ટ્રીટલાઇટ બંધ હતી. NAGAR-X પર માત્ર ફોટો પાડીને મૂક્યો અને બીજા જ દિવસે AMC ની ટીમ આવીને રિપેર કરી ગઈ!”",
      t1Translation: "“I am 68 years old. Just posted a photo with voice note in Gujarati, and our streetlight was fixed next day.”",
      t1Author: "Hasmukhbhai Patel",
      t1Role: "Senior Resident, Naranpura",
      t2Quote: "“We used to complain about open garbage on WhatsApp groups with no effect. On NAGAR-X, seeing the progress tracker change to 'Resolved' with before/after photos gave us genuine faith in local governance.”",
      t2Translation: "“Transparent AMC progress tracking brings actual accountability.”",
      t2Author: "Pooja Trivedi",
      t2Role: "Student & Youth Volunteer, Navrangpura",
      t3Quote: "“કોઈ વચેટિયા વગર સીધો મ્યુનિસિપલ કોર્પોરેશન સાથે સંવાદ. Our apartment association has resolved 14 water drainage issues this monsoon through simple 30-second tickets.”",
      t3Translation: "“Direct connection with municipal ward engineers without middlemen.”",
      t3Author: "Rameshwar Shah",
      t3Role: "RWA Secretary, Vastrapur"
    },
    cta: {
      eyebrow: "OPEN CIVIC PLATFORM",
      heading: "Ready to shape the future of your neighborhood?",
      desc: "Join over 64,000 citizens making Ahmedabad cleaner, greener, and more responsive every single day.",
      btnPrimary: "Create Free Citizen Account",
      btnSecondary: "Report Anonymously"
    },
    footer: {
      langLabel: "Choose Portal Language:",
      tollFree: "AMC Citizen Toll-Free: 155303",
      seniorHelp: "Senior Helpline Available",
      desc: "Universal Municipal Civic Engagement Platform",
      linkAbout: "About Project",
      linkAccess: "Senior & Citizen Accessibility",
      linkPrivacy: "Transparency & Privacy",
      linkRecords: "Open Records",
      copyright: "© 2025 NAGAR-X Public Infrastructure Initiative. Built for open municipal participation.",
      gridStatus: "City Grid Status: Nominal (100% Operational)"
    },
    dashboard: {
      backToHome: "Back to Home Page",
      headerHome: "Home",
      publicPortal: "Public Portal",
      searchPlaceholder: "Search people, places, issues...",
      reportIssueBtn: "Report Issue",
      communityFeed: "Community Feed",
      homeFeed: "Home Feed",
      explore: "Explore Wards",
      nearby: "Nearby Issues",
      cityServices: "City Services",
      wardMap: "Interactive Ward Map",
      myReports: "My Reports",
      communities: "RWA & Communities",
      events: "Civic Drives & Events",
      transparencyAudit: "Legal & Transparency Audit",
      authorityPortals: "Authority Portals",
      amcWardDesk: "AMC Ward Officer Desk",
      highAuthority: "Commissioner Audit Portal",
      forYou: "For You",
      following: "Following",
      nearbyWards: "Nearby Wards",
      postPlaceholder: "Share a civic update, event, or community report...",
      postBtn: "Post Update",
      civicScore: "Civic Score",
      level3: "Level 3 City Guardian",
      reported: "Reported",
      resolved: "Resolved",
      upvotes: "Upvotes",
      activeInspector: "Active Ward Inspector",
      trendingIssues: "Trending Ward Issues"
    }
  },
  gu: {
    navbar: {
      about: "પોર્ટલ વિશે",
      howItWorks: "કેવી રીતે કામ કરે છે",
      features: "મુખ્ય સુવિધાઓ",
      cityPulse: "સિટી પલ્સ (આંકડા)",
      login: "લોગિન",
      join: "NAGAR-X સાથે જોડાઓ"
    },
    hero: {
      badge: "નાગરિકો અને AMC માટે સત્તાવાર કડી",
      heading1: "તમારું શહેર.",
      heading2: "તમારી સોસાયટી.",
      subtitle: "તમારા પડોશ સાથે જોડાઓ, ૩૦ સેકન્ડમાં સ્થાનિક પ્રશ્નોની જાણ કરો, અને સ્વચ્છ, સુરક્ષિત અમદાવાદ માટે સાથે મળીને કામ કરો.",
      ctaPrimary: "NAGAR-X માં જોડાઓ (મફત) →",
      ctaSecondary: "શહેરનો નકશો જુઓ 🧭",
      noAadhaar: "જોવા માટે કોઈ આધાર કાર્ડ જરૂરી નથી",
      sla: "સરેરાશ AMC ઉકેલ સમય: ૪૮ કલાક",
      liveSync: "લાઈવ સિંક",
      liveLocation: "બોડકદેવ, વોર્ડ ૮ • આજે ૨ નવા ખાડાઓ રિપેર કરાયા"
    },
    features: {
      eyebrow: "નાગરિક શક્તિ હવે સરળ બની",
      heading: "દરેક અમદાવાદી માટે બનેલા સરળ સાધનો",
      f1Title: "૩૦ સેકન્ડમાં પ્રશ્નોની જાણ કરો",
      f1Desc: "બંધ સ્ટ્રીટલાઈટ, ખુલ્લો ખાડો, કે કચરાનો ઢગલો દેખાયો? ફોટો પાડો, લોકેશન ટેગ કરો અને AMC ને ઓટોમેટેડ જીઓ-ટેગવાળી ફરિયાદ તરત જ મળી જશે.",
      f1Link: "ઇન્સ્ટન્ટ GPS અને વોર્ડ આપોઆપ ઓળખ",
      f2Title: "પાડોશીઓ સાથે જોડાઓ",
      f2Desc: "સ્થાનિક પડોશી સમિતિઓમાં જોડાઓ, સપ્તાહાંતમાં સફાઈ અભિયાન, વૃક્ષારોપણ પ્રવૃત્તિઓનું આયોજન કરો અને પાડોશીઓ સાથે સલામતી અપડેટ્સ શેર કરો.",
      f2Link: "ચકાસાયેલ સોસાયટી સમુદાયો",
      f3Title: "પારદર્શક AMC અપડેટ્સ",
      f3Desc: "કોઈ ઓફિસના ધક્કા ખાવાના નહીં. AMC ફિલ્ડ એન્જિનિયર્સ ફરિયાદ સ્વીકારે, મોકલે, રિપેર કરે અને ફોટો સાથે સાબિતી અપલોડ કરે તે બધું લાઈવ ટ્રેક કરો.",
      f3Link: "જાહેર નિરીક્ષણ ડેશબોર્ડ"
    },
    howItWorks: {
      eyebrow: "સરળ નિવારણ પ્રક્રિયા",
      heading: "NAGAR-X ૪ પગલાંમાં કેવી રીતે કાર્ય કરે છે",
      subtitle: "ઝીરો લર્નિંગ કર્વ સાથે ડિઝાઇન કરેલ જેથી કોલેજના વિદ્યાર્થીઓથી લઈને વરિષ્ઠ નાગરિકો પણ કોઈ મુશ્કેલી વિના ભાગ લઈ શકે.",
      s1Title: "૧. સ્પોટ કરો (ધ્યાન દો)",
      s1Desc: "તમારી ગલીમાં કચરાપેટી ભરાઈ ગઈ હોય, પાણીની લાઈન તૂટી હોય, અથવા જોખમી વાયરો લટકતા હોય તે જુઓ.",
      s1Link: "રીઅલ-ટાઇમ જીઓ લોકેટર",
      s2Title: "૨. ફોટો પાડો અને મોકલો",
      s2Desc: "મોબાઈલથી ઝડપી ફોટો પાડો અથવા ગુજરાતી/હિન્દીમાં વોઈસ નોટ રેકોર્ડ કરો. કોઈ કાગળની માથાકૂટ નથી.",
      s2Link: "વોઇસ રિપોર્ટિંગ સપોર્ટ",
      s3Title: "૩. AMC ની કાર્યવાહી",
      s3Desc: "પ્રશ્ન આપોઆપ સંબંધિત AMC વોર્ડ ઓફિસરને સોંપવામાં આવે છે. સ્થિતિની અપડેટ્સ તમને SMS એલર્ટ દ્વારા મળશે.",
      s3Link: "ટ્રેક કરેલ ટર્નઅરાઉન્ડ SLA",
      s4Title: "૪. ચકાસાયેલ ઉકેલ",
      s4Desc: "વિભાગ ઉકેલનો ફોટો અપલોડ કરે છે. ફરિયાદ બંધ કરતા પહેલા તમે અને સોસાયટીના સભ્યો ઉકેલની ખાતરી કરો છો.",
      s4Link: "નાગરિક ઓડિટ વેરિફાઇડ"
    },
    pulse: {
      eyebrow: "પબ્લિક પલ્સ (જાહેર આંકડા)",
      heading: "દરેક શેરીમાં દેખાતો બદલાવ.",
      subtitle: "ખુલ્લા નાગરિક ડેટા પારદર્શિતા ધોરણો હેઠળ તમામ ટિકિટ આંકડાઓ સાર્વજનિક ઓડિટ માટે ઉપલબ્ધ છે.",
      stat1Title: "૧,૪૨૦+",
      stat1Desc: "ઉકેલાયેલા પ્રશ્નો • આ મહિને માત્ર વિવિધ વોર્ડમાં",
      stat2Title: "૪૮ / ૪૮",
      stat2Desc: "AMC વોર્ડ્સ • સક્રિય વોર્ડ નિરીક્ષકો સાથે ૧૦૦% આવરી લેવાયેલ",
      stat3Title: "૬૪,૦૦૦+",
      stat3Desc: "સક્રિય નાગરિકો • રોજિંદી સામુદાયિક ગૌરવની ભાવના",
    },
    grassroots: {
      eyebrow: "સ્થાનિક હાઇલાઇટ",
      heading: "વિશેષ પડોશી પહેલ",
      viewAll: "વોર્ડની તમામ પ્રવૃત્તિઓ જુઓ →",
      badge: "સત્તાવાર સમુદાય ઝુંબેશ",
      location: "સાબરમતી રિવરફ્રન્ટ પ્રોમેનેડ, પશ્ચિમ ઝોન",
      title: "સાબરમતી રિવરફ્રન્ટ ગ્રીન એન્ડ ક્લીન ઝુંબેશ",
      desc: "SEWA યુવા સ્વયંસેવકો અને મ્યુનિસિપલ સફાઈ ટીમો સાથે મળીને ૧,૨૦૦ દેશી રોપાઓ વાવવા અને સ્માર્ટ માઇક્રો-કમ્પોસ્ટિંગ યુનિટ્સ સ્થાપિત કરવાનો સહિયારો પ્રયાસ.",
      volunteers: "નોંધાયેલા સ્વયંસેવકો",
      timeLabel: "આ શનિવારે",
      timeValue: "સવારે ૦૭:૦૦ થી ૧૦:૩૦",
      rsvpBtn: "RSVP - ઝુંબેશમાં જોડાઓ",
      shareBtn: "સોસાયટી સાથે શેર કરો"
    },
    voices: {
      eyebrow: "અમદાવાદનો અવાજ",
      heading: "પરિવારના દરેક સભ્ય માટે વાપરવામાં સરળ",
      t1Quote: "“હું 68 વર્ષનો છું. અમારી સોસાયટી બહાર ૨ મહિનાથી સ્ટ્રીટલાઇટ બંધ હતી. NAGAR-X પર માત્ર ફોટો પાડીને મૂક્યો અને બીજા જ દિવસે AMC ની ટીમ આવીને રિપેર કરી ગઈ!”",
      t1Translation: "“મારી ઉંમર ૬૮ વર્ષની છે. મેં ગુજરાતીમાં વોઈસ નોટ સાથે માત્ર ફોટો પોસ્ટ કર્યો, અને બીજા જ દિવસે અમારી સ્ટ્રીટલાઈટ ચાલુ થઈ ગઈ.”",
      t1Author: "હસમુખભાઈ પટેલ",
      t1Role: "વરિષ્ઠ નાગરિક, નારણપુરા",
      t2Quote: "“અમે પહેલા વોટ્સએપ ગ્રૂપમાં ફરિયાદો કરતા જેની કોઈ અસર નહોતી થતી. NAGAR-X પર, ફરિયાદ 'Resolved' થઈ તેનો ફોટો જોઈને અમને સ્થાનિક શાસનમાં ખરેખર વિશ્વાસ બેઠો છે.”",
      t2Translation: "“પારદર્શક AMC પ્રગતિ ટ્રેકિંગ વાસ્તવિક જવાબદારી લાવે છે.”",
      t2Author: "પૂજા ત્રિવેદી",
      t2Role: "વિદ્યાર્થી અને યુવા સ્વયંસેવક, નવરંગપુરા",
      t3Quote: "“કોઈ વચેટિયા વગર સીધો મ્યુનિસિપલ કોર્પોરેશન સાથે સંવાદ. અમારી એપાર્ટમેન્ટ એસોસિએશને આ ચોમાસામાં સરળ ટિકિટ દ્વારા પાણી નિકાલના ૧૪ પ્રશ્નો ઉકેલ્યા છે.”",
      t3Translation: "“મધ્યસ્થી વગર સીધા મ્યુનિસિપલ વોર્ડ એન્જિનિયરો સાથે જોડાણ.”",
      t3Author: "રમેશચંદ્ર શાહ",
      t3Role: "RWA સેક્રેટરી, વસ્ત્રાપુર"
    },
    cta: {
      eyebrow: "ઓપન સિવિક પ્લેટફોર્મ",
      heading: "તમારા પડોશના ભવિષ્યને આકાર આપવા તૈયાર છો?",
      desc: "અમદાવાદને રોજ વધુ સ્વચ્છ, હરિયાળું અને વધુ પ્રતિભાવશીલ બનાવતા ૬૪,૦૦૦ થી વધુ નાગરિકો સાથે જોડાઓ.",
      btnPrimary: "મફત નાગરિક ખાતું બનાવો",
      btnSecondary: "અનામી (ગુપ્ત) ફરિયાદ કરો"
    },
    footer: {
      langLabel: "પોર્ટલ ભાષા પસંદ કરો:",
      tollFree: "AMC સિવિઝન ટોલ-ફ્રી: 155303",
      seniorHelp: "વરિષ્ઠ નાગરિકો માટે હેલ્પલાઇન ઉપલબ્ધ",
      desc: "સાર્વત્રિક મ્યુનિસિપલ નાગરિક જોડાણ મંચ",
      linkAbout: "પ્રોજેક્ટ વિશે",
      linkAccess: "વરિષ્ઠ અને વિકલાંગ સુગમતા",
      linkPrivacy: "પારદર્શિતા અને ગોપનીયતા",
      linkRecords: "ખુલ્લા દસ્તાવેજો",
      copyright: "© ૨૦૨૫ NAGAR-X જાહેર ઇન્ફ્રાસ્ટ્રક્ચર પહેલ. સાર્વજનિક સહભાગિતા માટે નિર્મિત.",
      gridStatus: "સિટી ગ્રીડ સ્થિતિ: સામાન્ય (૧૦૦% કાર્યરત)"
    },
    dashboard: {
      backToHome: "મુખ્ય હોમ પેજ પર પાછા જાવ",
      headerHome: "હોમ (મુખ્ય)",
      publicPortal: "જાહેર પોર્ટલ",
      searchPlaceholder: "લોકો, સ્થળો, ફરિયાદો શોધો...",
      reportIssueBtn: "ફરિયાદ નોંધાવો",
      communityFeed: "સમુદાય ફીડ",
      homeFeed: "મુખ્ય ફીડ",
      explore: "એક્સપ્લોર વોર્ડ્સ",
      nearby: "નજીકના પ્રશ્નો",
      cityServices: "સિટી સેવાઓ કેન્દ્ર",
      wardMap: "ઇન્ટરેક્ટિવ વોર્ડ નકશો",
      myReports: "મારા અહેવાલો",
      communities: "સોસાયટી સમુદાયો",
      events: "ઝુંબેશ અને પ્રોગ્રામ",
      transparencyAudit: "પારદર્શિતા અને ઓડિટ લોગ્સ",
      authorityPortals: "અધિકારી પોર્ટલ",
      amcWardDesk: "AMC વોર્ડ ઓફિસર પોર્ટલ",
      highAuthority: "કમિશનર ઓડિટ પોર્ટલ",
      forYou: "તમારા માટે",
      following: "ફોલોઈંગ",
      nearbyWards: "નજીકના વોર્ડ",
      postPlaceholder: "નાગરિક અપડેટ, ઇવેન્ટ અથવા રિપોર્ટ પોસ્ટ કરો...",
      postBtn: "અપડેટ પોસ્ટ કરો",
      civicScore: "નાગરિક સ્કોર",
      level3: "લેવલ ૩ સિટી ગાર્ડિયન",
      reported: "નોંધાયેલ",
      resolved: "ઉકેલાયેલ",
      upvotes: "વોટ મળ્યા",
      activeInspector: "સક્રિય વોર્ડ અફસર",
      trendingIssues: "ટ્રેન્ડિંગ સમસ્યાઓ"
    }
  },
  hi: {
    navbar: {
      about: "पोर्टल के बारे में",
      howItWorks: "यह कैसे काम करता है",
      features: "मुख्य विशेषताएं",
      cityPulse: "सिटी पल्स (आंकड़े)",
      login: "लॉगिन",
      join: "NAGAR-X से जुड़ें"
    },
    hero: {
      badge: "नागरिकों और AMC के लिए आधिकारिक सेतु",
      heading1: "आपका शहर।",
      heading2: "आपका समुदाय।",
      subtitle: "अपने पड़ोस से जुड़ें, ३० सेकंड में स्थानीय मुद्दों की रिपोर्ट करें, और एक स्वच्छ, सुरक्षित अहमदाबाद के लिए मिलकर काम करें.",
      ctaPrimary: "NAGAR-X से जुड़ें (निःशुल्क) →",
      ctaSecondary: "शहर का नक्शा देखें 🧭",
      noAadhaar: "देखने के लिए आधार कार्ड की आवश्यकता नहीं",
      sla: "औसत AMC कार्रवाई समय: ४८ घंटे",
      liveSync: "लाइव सिंक",
      liveLocation: "बोदकदेव, वार्ड ८ • आज २ नए गड्ढे ठीक किए गए"
    },
    features: {
      eyebrow: "नागरिक शक्ति अब हुई आसान",
      heading: "हर अमदावादी के लिए बने सरल उपकरण",
      f1Title: "३० सेकंड में समस्या की रिपोर्ट करें",
      f1Desc: "खराब स्ट्रीटलाइट, खुला गड्ढा, या कचरे का ढेर दिखा? फोटो लें, स्थान टैग करें और AMC को तुरंत एक स्वचालित जियो-टैग किया गया टिकट मिल जाएगा।",
      f1Link: "त्वरित GPS और वार्ड स्वचालित पहचान",
      f2Title: "पड़ोसियों से जुड़ें",
      f2Desc: "स्थानीय पड़ोस समितियों में शामिल हों, सप्ताहांत सफाई अभियान, वृक्षारोपण गतिविधियों का आयोजन करें और पड़ोसियों के साथ सुरक्षा अपडेट साझा करें।",
      f2Link: "सत्यापित सोसाइटी समुदाय",
      f3Title: "पारदर्शी AMC अपडेट",
      f3Desc: "कोई अंतहीन चक्कर काटने की जरूरत नहीं। AMC फील्ड इंजीनियरों द्वारा शिकायत स्वीकार करने, काम शुरू करने, समस्या ठीक करने और फोटो अपलोड करने तक सब लाइव ट्रैक करें।",
      f3Link: "सार्वजनिक निरीक्षण डैशबोर्ड"
    },
    howItWorks: {
      eyebrow: "आसान समाधान प्रक्रिया",
      heading: "NAGAR-X ४ चरणों में कैसे कार्य करता है",
      subtitle: "शून्य सीखने के वक्र के साथ डिज़ाइन किया गया ताकि कॉलेज के छात्रों से लेकर वरिष्ठ नागरिक भी बिना किसी परेशानी के भाग ले सकें।",
      s1Title: "१. स्पॉट करें (पहचानें)",
      s1Desc: "अपनी गली में बहते कचरे के डिब्बे, टूटी पानी की पाइपलाइन, या खतरनाक लटकते बिजली के तारों को देखें।",
      s1Link: "रीअल-टाइम जियो लोकेटर",
      s2Title: "२. फोटो लें और भेजें",
      s2Desc: "मोबाइल से त्वरित फोटो लें या गुजराती/हिंदी में वॉयस नोट रिकॉर्ड करें। कोई कागजी कार्रवाई नहीं।",
      s2Link: "वॉयस रिपोर्टिंग सहायता उपलब्ध",
      s3Title: "३. AMC की कार्रवाई",
      s3Desc: "मुद्दा स्वचालित रूप से संबंधित AMC वार्ड अधिकारी को सौंप दिया जाता है। स्थिति की अपडेट आपको SMS अलर्ट द्वारा मिलेगी।",
      s3Link: "ट्रैक किया गया टर्नअराउंड SLA",
      s4Title: "४. सत्यापित समाधान",
      s4Desc: "विभाग समाधान का फोटो अपलोड करता है। शिकायत बंद करने से पहले आप और आपके पड़ोसी समाधान की पुष्टि करते हैं।",
      s4Link: "नागरिक ऑडिट सत्यापित"
    },
    pulse: {
      eyebrow: "पब्लिक पल्स",
      heading: "हर सड़क पर दिखाई देता बदलाव।",
      subtitle: "खुले नागरिक डेटा पारदर्शिता मानकों के तहत सभी शिकायत आंकड़े सार्वजनिक ऑडिट के लिए उपलब्ध हैं।",
      stat1Title: "१,४२०+",
      stat1Desc: "सुलझाए गए मुद्दे • केवल इस महीने विभिन्न वार्डों में",
      stat2Title: "४८ / ४८",
      stat2Desc: "AMC वार्ड • सक्रिय वार्ड निरीक्षकों के साथ १००% कवर",
      stat3Title: "६४,०००+",
      stat3Desc: "सक्रिय नागरिक • दैनिक सामुदायिक गर्व की भावना",
    },
    grassroots: {
      eyebrow: "स्थानीय सुर्खियां",
      heading: "विशेष पड़ोस पहल",
      viewAll: "वार्ड की सभी गतिविधियां देखें →",
      badge: "आधिकारिक सामुदायिक अभियान",
      location: "साबरमती रिवरफ्रंट प्रोमेनेड, पश्चिम क्षेत्र",
      title: "साबरमती रिवरफ्रंट ग्रीन एंड क्लीन अभियान",
      desc: "SEWA युवा स्वयंसेवकों और नगरपालिका स्वच्छता टीमों के साथ मिलकर १,२०० देशी पौधे लगाने और स्मार्ट माइक्रो-कंपोस्टिंग इकाइयां स्थापित करने का संयुक्त प्रयास।",
      volunteers: "पंजीकृत स्वयंसेवक",
      timeLabel: "इस शनिवार",
      timeValue: "सुबह ०७:०० से १०:३०",
      rsvpBtn: "RSVP - अभियान में शामिल हों",
      shareBtn: "सोसाइटी के साथ साझा करें"
    },
    voices: {
      eyebrow: "अहमदाबाद की आवाज़ें",
      heading: "परिवार के हर सदस्य के लिए उपयोग में सरल",
      t1Quote: "“હું 68 વર્ષનો છું. અમારી સોસાયટી બહાર ૨ મહિનાથી સ્ટ્રીટલાઇટ બંધ હતી. NAGAR-X પર માત્ર ફોટો પાડીને મૂક્યો અને બીજા જ દિવસે AMC ની ટીમ આવીને રિપેર કરી ગઈ!”",
      t1Translation: "“मैं ६८ वर्ष का हूं। मैंने गुजराती में वॉयस नोट के साथ केवल फोटो पोस्ट किया, और अगले ही दिन हमारी स्ट्रीटलाइट ठीक हो गई।”",
      t1Author: "हसमुखभाई पटेल",
      t1Role: "वरिष्ठ नागरिक, नारणपुरा",
      t2Quote: "“हम पहले व्हाट्सएप ग्रुपों पर शिकायत करते थे जिसका कोई असर नहीं होता था। NAGAR-X पर, स्थिति 'Resolved' होने और पहले/बाद की फोटो देखने के बाद प्रशासन में हमारा भरोसा बहाल हुआ।”",
      t2Translation: "“पारदर्शी AMC प्रगति ट्रैकिंग वास्तविक जवाबदेही लाती है।”",
      t2Author: "पूजा त्रिवेदी",
      t2Role: "छात्र और युवा स्वयंसेवक, नवरंगपुरा",
      t3Quote: "“કોઈ વચેટિયા વગર સીધો મ્યુનિસિપલ કોર્પોરેશન સાથે સંવાદ. हमारी अपार्टमेंट एसोसिएशन ने इस मानसून में केवल ३० सेकंड के टिकट के माध्यम से पानी की निकासी के १४ मुद्दों का समाधान किया है।”",
      t3Translation: "“बिना किसी बिचौलियों के सीधे नगरपालिका वार्ड इंजीनियरों के साथ संपर्क।”",
      t3Author: "रामेश्वर शाह",
      t3Role: "RWA सचिव, वस्त्रापुर"
    },
    cta: {
      eyebrow: "ओपन सिविक प्लेटफॉर्म",
      heading: "अपने पड़ोस के भविष्य को संवारने के लिए तैयार हैं?",
      desc: "अहमदाबाद को रोजाना अधिक स्वच्छ, हरा-भरा और उत्तरदायी बनाने वाले ६४,००० से अधिक नागरिकों के साथ जुड़ें।",
      btnPrimary: "मुफ्त नागरिक खाता बनाएं",
      btnSecondary: "गुमनाम रूप से रिपोर्ट करें"
    },
    footer: {
      langLabel: "पोर्टल भाषा चुनें:",
      tollFree: "AMC नागरिक टोल-फ्री: 155303",
      seniorHelp: "वरिष्ठ नागरिकों के लिए हेल्पलाइन उपलब्ध",
      desc: "सार्वभौमिक नगरपालिका नागरिक जुड़ाव मंच",
      linkAbout: "परियोजना के बारे में",
      linkAccess: "वरिष्ठ और नागरिक सुगमता",
      linkPrivacy: "पारदर्शिता और गोपनीयता",
      linkRecords: "खुले दस्तावेज",
      copyright: "© २०२५ NAGAR-X सार्वजनिक बुनियादी ढांचा पहल। सार्वजनिक भागीदारी के लिए निर्मित।",
      gridStatus: "सिटी ग्रिड स्थिति: सामान्य (१००% चालू)"
    },
    dashboard: {
      backToHome: "मुख्य होम पेज पर वापस जाएं",
      headerHome: "होम (मुख्य)",
      publicPortal: "सार्वजनिक पोर्टल",
      searchPlaceholder: "लोग, स्थान, मुद्दे खोजें...",
      reportIssueBtn: "समस्या दर्ज करें",
      communityFeed: "सामुदायिक फीड",
      homeFeed: "होम फीड",
      explore: "एक्सप्लोर वार्ड",
      nearby: "पास के मुद्दे",
      cityServices: "शहर सेवा केंद्र",
      wardMap: "इंटरैक्टिव वार्ड मानचित्र",
      myReports: "मेरी रिपोर्ट",
      communities: "सोसाइटी समुदाय",
      events: "अभियान और कार्यक्रम",
      transparencyAudit: "पारदर्शिता और ऑडिट लॉग",
      authorityPortals: "अधिकारी पोर्टल",
      amcWardDesk: "AMC वार्ड अधिकारी पोर्टल",
      highAuthority: "आयुक्त ऑडिट पोर्टल",
      forYou: "आपके लिए",
      following: "फॉलोइंग",
      nearbyWards: "पास के वार्ड",
      postPlaceholder: "नागरिक अपडेट, कार्यक्रम या रिपोर्ट साझा करें...",
      postBtn: "अपडेट पोस्ट करें",
      civicScore: "नागरिक स्कोर",
      level3: "लेवल ३ सिटी गार्डियन",
      reported: "रिपोर्ट किए गए",
      resolved: "सुलझाए गए",
      upvotes: "वोट मिले",
      activeInspector: "सक्रिय वार्ड अधिकारी",
      trendingIssues: "ट्रेंडिंग मुद्दे"
    }
  }
};
