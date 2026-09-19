export interface WardLocation {
  id: string;
  name: string;
  nameGu: string;
  nameHi: string;
  wardNumber: number;
  lat: number;
  lng: number;
  landmarks: string[];
}

export const AHMEDABAD_WARDS_DATA: WardLocation[] = [
  {
    id: 'bodakdev',
    name: 'Bodakdev, Ward 8',
    nameGu: 'બોડકદેવ, વોર્ડ ૮',
    nameHi: 'बोडकदेव, वार्ड ८',
    wardNumber: 8,
    lat: 23.0385,
    lng: 72.5119,
    landmarks: ['Pakwan Crossroad', 'Judges Bungalow', 'Sindhu Bhavan Road']
  },
  {
    id: 'navrangpura',
    name: 'Navrangpura, Ward 4',
    nameGu: 'નવરંગપુરા, વોર્ડ ૪',
    nameHi: 'नवरंगपुरा, वार्ड ४',
    wardNumber: 4,
    lat: 23.0375,
    lng: 72.5520,
    landmarks: ['HL College', 'Commerce Six Roads', 'Gujarat University', 'Municipal Market']
  },
  {
    id: 'vastrapur',
    name: 'Vastrapur, Ward 6',
    nameGu: 'વસ્ત્રાપુર, વોર્ડ ૬',
    nameHi: 'वस्त्रापुर, वार्ड ६',
    wardNumber: 6,
    lat: 23.0350,
    lng: 72.5293,
    landmarks: ['Vastrapur Lake', 'IIM Ahmedabad', 'Alpha One Mall']
  },
  {
    id: 'satellite',
    name: 'Satellite, Ward 7',
    nameGu: 'સેટેલાઇટ, વોર્ડ ૭',
    nameHi: 'सैटेलाइट, वार्ड ७',
    wardNumber: 7,
    lat: 23.0225,
    lng: 72.5284,
    landmarks: ['Shivranjani Cross Roads', 'Jodhpur Char Rasta', 'ISRO']
  },
  {
    id: 'thaltej',
    name: 'Thaltej, Ward 9',
    nameGu: 'થલતેજ, વોર્ડ ૯',
    nameHi: 'थलतेज, वार्ड ९',
    wardNumber: 9,
    lat: 23.0515,
    lng: 72.5270,
    landmarks: ['Science City Road', 'Acropolis Mall', 'Drive-in Road']
  },
  {
    id: 'naranpura',
    name: 'Naranpura, Ward 3',
    nameGu: 'નારણપુરા, વોર્ડ ૩',
    nameHi: 'नारनपुरा, वार्ड ३',
    wardNumber: 3,
    lat: 23.0520,
    lng: 72.5530,
    landmarks: ['Ankur Cross Roads', 'Pragatinagar', 'Shastrinagar']
  },
  {
    id: 'paldi',
    name: 'Paldi, Ward 5',
    nameGu: 'પાલડી, વોર્ડ ૫',
    nameHi: 'पालड़ी, वार्ड ५',
    wardNumber: 5,
    lat: 23.0130,
    lng: 72.5620,
    landmarks: ['Mahalakshmi Five Roads', 'NID', 'Museum', 'Kocharab Ashram']
  },
  {
    id: 'ghatlodia',
    name: 'Ghatlodia, Ward 2',
    nameGu: 'ઘાટલોડિયા, વોર્ડ ૨',
    nameHi: 'घाटलोडिया, वार्ड २',
    wardNumber: 2,
    lat: 23.0670,
    lng: 72.5350,
    landmarks: ['Chanakyapuri', 'Ranna Park', 'Prabhat Chowk']
  },
  {
    id: 'sabarmati',
    name: 'Sabarmati, Ward 1',
    nameGu: 'સાબરમતી, વોર્ડ ૧',
    nameHi: 'साबरमती, वार्ड १',
    wardNumber: 1,
    lat: 23.0800,
    lng: 72.5800,
    landmarks: ['Gandhi Ashram', 'Sabarmati Railway Station', 'D-Cabin']
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur, Ward 10',
    nameGu: 'જોધપુર, વોર્ડ ૧૦',
    nameHi: 'जोधपुर, वार्ड १०',
    wardNumber: 10,
    lat: 23.0180,
    lng: 72.5180,
    landmarks: ['Prahladnagar Garden', 'Anandnagar Road', 'Vejalpur Link']
  },
  {
    id: 'maninagar',
    name: 'Maninagar, Ward 32',
    nameGu: 'મણિનગર, વોર્ડ ૩૨',
    nameHi: 'मणिनगर, वार्ड ३२',
    wardNumber: 32,
    lat: 23.0063,
    lng: 72.5995,
    landmarks: ['Kankaria Lake', 'Maninagar Station', 'Rambaug']
  }
];

export const AHMEDABAD_WARDS_LIST = AHMEDABAD_WARDS_DATA.map(w => w.name);

// Calculate distance between two GPS coordinates in meters
export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Find nearest municipal ward from live GPS coordinates
export function findNearestWard(lat: number, lng: number): { ward: WardLocation; distanceMeters: number } {
  let nearestWard = AHMEDABAD_WARDS_DATA[0];
  let minDistance = Infinity;

  for (const ward of AHMEDABAD_WARDS_DATA) {
    const dist = getDistanceMeters(lat, lng, ward.lat, ward.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestWard = ward;
    }
  }

  return { ward: nearestWard, distanceMeters: minDistance };
}
