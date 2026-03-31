export interface Hospital {
  id: string;
  name: string;
  location: string;
  distance: number; // in km
  lastUpdatedMinutes: number; // minutes ago
  availableBeds: {
    general: number;
    icu: number;
    ventilator: number;
  };
  totalBeds: {
    general: number;
    icu: number;
    ventilator: number;
  };
  contact: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospitalId: string;
  hospitalName: string;
  availableToday: boolean;
  timings: string;
  fees: number;
  nextAvailable: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  distance: number; // in km
  lastUpdatedMinutes: number; // minutes ago
  availableBeds: {
    general: number;
    icu: number;
    ventilator: number;
  };
  totalBeds: {
    general: number;
    icu: number;
    ventilator: number;
  };
  contact: string;
}

export const mockHospitals: Hospital[] = [
  // --- ORIGINAL DATA ---
  {
    id: "h1",
    name: "City General Hospital",
    location: "Downtown Medical District",
    distance: 2.4,
    lastUpdatedMinutes: 2,
    availableBeds: { general: 12, icu: 2, ventilator: 0 },
    totalBeds: { general: 150, icu: 20, ventilator: 10 },
    contact: "+91 98765 43210"
  },
  {
    id: "h2",
    name: "St. Jude's Care Center",
    location: "Westside Suburbs",
    distance: 5.1,
    lastUpdatedMinutes: 15,
    availableBeds: { general: 45, icu: 8, ventilator: 4 },
    totalBeds: { general: 200, icu: 30, ventilator: 15 },
    contact: "+91 98765 43211"
  },
  {
    id: "h3",
    name: "Metro Apex Hospital",
    location: "Tech Park Road",
    distance: 1.2,
    lastUpdatedMinutes: 45, 
    availableBeds: { general: 0, icu: 1, ventilator: 2 },
    totalBeds: { general: 100, icu: 15, ventilator: 8 },
    contact: "+91 98765 43212"
  },
  {
    id: "h4",
    name: "Lifeline Super Specialty",
    location: "North Highway",
    distance: 3.8,
    lastUpdatedMinutes: 1, 
    availableBeds: { general: 8, icu: 4, ventilator: 2 },
    totalBeds: { general: 120, icu: 25, ventilator: 12 },
    contact: "+91 98765 43213"
  },
  {
    id: "h5",
    name: "Green Valley Clinic (Stale/Full)",
    location: "South End Alley",
    distance: 0.8, 
    lastUpdatedMinutes: 1440, 
    availableBeds: { general: 0, icu: 0, ventilator: 0 }, 
    totalBeds: { general: 50, icu: 5, ventilator: 2 },
    contact: "+91 98765 43214"
  },
  {
    id: "h6",
    name: "Pioneer Medical City (Far/Fresh)",
    location: "Outskirts Ring Road",
    distance: 28.5, 
    lastUpdatedMinutes: 0, 
    availableBeds: { general: 145, icu: 22, ventilator: 18 },
    totalBeds: { general: 500, icu: 80, ventilator: 40 },
    contact: "+91 98765 43215"
  },

  // --- NEW VARYING DATA ---

  // The "Hidden Gem" (Very close, highly fresh, good capacity. Should rank #1 often)
  {
    id: "h7",
    name: "Sunrise Emergency Center",
    location: "Central Avenue",
    distance: 1.5,
    lastUpdatedMinutes: 3,
    availableBeds: { general: 18, icu: 4, ventilator: 2 },
    totalBeds: { general: 60, icu: 10, ventilator: 5 },
    contact: "+91 98765 43216"
  },
  
  // The "Deceptive ICU" (Decent score, but literally 0 ICU beds. A good visual edge case for users looking specifically for ICU)
  {
    id: "h8",
    name: "Hope Community Hospital",
    location: "Eastside Sector 4",
    distance: 3.2,
    lastUpdatedMinutes: 12,
    availableBeds: { general: 55, icu: 0, ventilator: 0 },
    totalBeds: { general: 100, icu: 8, ventilator: 4 },
    contact: "+91 98765 43217"
  },

  // The "Overloaded Government Hospital" (Huge total capacity, but almost entirely full, older data)
  {
    id: "h9",
    name: "State District Hospital",
    location: "Old City Center",
    distance: 6.8,
    lastUpdatedMinutes: 180, // 3 hours old
    availableBeds: { general: 5, icu: 1, ventilator: 0 },
    totalBeds: { general: 800, icu: 60, ventilator: 30 },
    contact: "+91 98765 43218"
  },

  // The "Suburban Reliable" (Further away, but solidly updated and available)
  {
    id: "h10",
    name: "Oakwood Healthcare",
    location: "Suburban Layout Phase 2",
    distance: 12.4,
    lastUpdatedMinutes: 8,
    availableBeds: { general: 32, icu: 5, ventilator: 3 },
    totalBeds: { general: 150, icu: 20, ventilator: 10 },
    contact: "+91 98765 43219"
  },

  // The "Traffic Jam" (Close by, but data is dangerously stale)
  {
    id: "h11",
    name: "Crescent Nursing Home",
    location: "Market Road",
    distance: 2.1,
    lastUpdatedMinutes: 320, // Over 5 hours old
    availableBeds: { general: 4, icu: 1, ventilator: 1 },
    totalBeds: { general: 40, icu: 4, ventilator: 2 },
    contact: "+91 98765 43220"
  },

  // Standard Mid-tier options
  {
    id: "h12",
    name: "Global Health Institute",
    location: "Financial District",
    distance: 8.5,
    lastUpdatedMinutes: 25,
    availableBeds: { general: 28, icu: 6, ventilator: 2 },
    totalBeds: { general: 250, icu: 40, ventilator: 20 },
    contact: "+91 98765 43221"
  },
  {
    id: "h13",
    name: "Trinity Multi-Specialty",
    location: "Lakeview Promenade",
    distance: 4.7,
    lastUpdatedMinutes: 5,
    availableBeds: { general: 14, icu: 2, ventilator: 1 },
    totalBeds: { general: 90, icu: 12, ventilator: 6 },
    contact: "+91 98765 43222"
  },
  {
    id: "h14",
    name: "Silver Cross Medical",
    location: "Industrial Estate Zone",
    distance: 15.2,
    lastUpdatedMinutes: 45,
    availableBeds: { general: 40, icu: 8, ventilator: 5 },
    totalBeds: { general: 180, icu: 25, ventilator: 10 },
    contact: "+91 98765 43223"
  },

  // The "Perfect Data, Terrible Location"
  {
    id: "h15",
    name: "Apex Regional Trauma Center",
    location: "Highway 44 Junction",
    distance: 42.0,
    lastUpdatedMinutes: 1,
    availableBeds: { general: 80, icu: 15, ventilator: 10 },
    totalBeds: { general: 400, icu: 50, ventilator: 25 },
    contact: "+91 98765 43224"
  },

  // The "Ghost Town" (Data hasn't been updated in 3 days)
  {
    id: "h16",
    name: "Heritage Medical Trust",
    location: "Old Cantonment",
    distance: 5.5,
    lastUpdatedMinutes: 4320, // 3 days
    availableBeds: { general: 10, icu: 2, ventilator: 1 },
    totalBeds: { general: 100, icu: 15, ventilator: 5 },
    contact: "+91 98765 43225"
  },

  // Micro-Clinics (Only useful for general beds, no ICU)
  {
    id: "h17",
    name: "Family Care Clinic",
    location: "Residential Block B",
    distance: 1.1,
    lastUpdatedMinutes: 10,
    availableBeds: { general: 3, icu: 0, ventilator: 0 },
    totalBeds: { general: 10, icu: 0, ventilator: 0 },
    contact: "+91 98765 43226"
  },
  {
    id: "h18",
    name: "Nightingale Maternity & General",
    location: "Garden Layout",
    distance: 3.4,
    lastUpdatedMinutes: 22,
    availableBeds: { general: 12, icu: 0, ventilator: 0 },
    totalBeds: { general: 30, icu: 2, ventilator: 0 },
    contact: "+91 98765 43227"
  },

  // More standard variations to fill out the scatter plot
  {
    id: "h19",
    name: "Pulse Network Hospital",
    location: "IT Corridor",
    distance: 7.2,
    lastUpdatedMinutes: 18,
    availableBeds: { general: 22, icu: 4, ventilator: 3 },
    totalBeds: { general: 140, icu: 20, ventilator: 12 },
    contact: "+91 98765 43228"
  },
  {
    id: "h20",
    name: "Harmony Healthcare",
    location: "South Ring",
    distance: 9.9,
    lastUpdatedMinutes: 55,
    availableBeds: { general: 15, icu: 1, ventilator: 0 },
    totalBeds: { general: 110, icu: 14, ventilator: 8 },
    contact: "+91 98765 43229"
  },
  {
    id: "h21",
    name: "Vanguard Medical Group",
    location: "North Suburbs",
    distance: 18.5,
    lastUpdatedMinutes: 14,
    availableBeds: { general: 65, icu: 12, ventilator: 6 },
    totalBeds: { general: 320, icu: 45, ventilator: 20 },
    contact: "+91 98765 43230"
  },
  {
    id: "h22",
    name: "Zenith Emergency Clinic",
    location: "Metro Station Road",
    distance: 2.8,
    lastUpdatedMinutes: 120, // 2 hours
    availableBeds: { general: 8, icu: 2, ventilator: 1 },
    totalBeds: { general: 45, icu: 6, ventilator: 3 },
    contact: "+91 98765 43231"
  },
  {
    id: "h23",
    name: "Guardian Angels Hospital",
    location: "West Point",
    distance: 6.4,
    lastUpdatedMinutes: 4,
    availableBeds: { general: 19, icu: 5, ventilator: 2 },
    totalBeds: { general: 130, icu: 18, ventilator: 10 },
    contact: "+91 98765 43232"
  },
  {
    id: "h24",
    name: "Kalyani Memorial",
    location: "University Campus",
    distance: 4.1,
    lastUpdatedMinutes: 85,
    availableBeds: { general: 0, icu: 0, ventilator: 1 },
    totalBeds: { general: 80, icu: 10, ventilator: 5 },
    contact: "+91 98765 43233"
  },
  {
    id: "h25",
    name: "Beacon Charitable Hospital",
    location: "Riverside District",
    distance: 11.0,
    lastUpdatedMinutes: 30,
    availableBeds: { general: 45, icu: 7, ventilator: 4 },
    totalBeds: { general: 210, icu: 25, ventilator: 15 },
    contact: "+91 98765 43234"
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Ananya Sharma",
    specialty: "Cardiology",
    hospitalId: "h4",
    hospitalName: "Lifeline Super Specialty",
    availableToday: true,
    timings: "10:00 AM - 04:00 PM",
    fees: 800,
    nextAvailable: "Today, 10:30 AM"
  },
  {
    id: "d2",
    name: "Dr. Rajesh Kumar",
    specialty: "Neurology",
    hospitalId: "h1",
    hospitalName: "City General Hospital",
    availableToday: false,
    timings: "11:00 AM - 02:00 PM",
    fees: 1200,
    nextAvailable: "Tomorrow, 11:00 AM"
  },
  {
    id: "d3",
    name: "Dr. Sarah Thomas",
    specialty: "Pediatrics",
    hospitalId: "h2",
    hospitalName: "St. Jude's Care Center",
    availableToday: true,
    timings: "09:00 AM - 01:00 PM",
    fees: 600,
    nextAvailable: "Today, 11:15 AM"
  },
  {
    id: "d4",
    name: "Dr. Vikram Singh",
    specialty: "Orthopedics",
    hospitalId: "h2",
    hospitalName: "St. Jude's Care Center",
    availableToday: true,
    timings: "02:00 PM - 07:00 PM",
    fees: 900,
    nextAvailable: "Today, 02:00 PM"
  },
  {
    id: "d5",
    name: "Dr. Priya Patel",
    specialty: "Cardiology",
    hospitalId: "h1",
    hospitalName: "City General Hospital",
    availableToday: true,
    timings: "04:00 PM - 08:00 PM",
    fees: 1000,
    nextAvailable: "Today, 04:30 PM"
  },
  // --- NEW EDGE CASE DOCTORS ---
  {
    id: "d6",
    name: "Dr. Amit Verma",
    specialty: "Cardiology", // Edge: Duplicates d1 and d5 to ensure multiple items render per filter
    hospitalId: "h4",
    hospitalName: "Lifeline Super Specialty",
    availableToday: true,
    timings: "06:00 PM - 11:00 PM", // Edge: Late night shift
    fees: 0, // Edge: Free consultation (tests if UI renders 0 correctly instead of failing a truthy check)
    nextAvailable: "Today, 06:15 PM"
  },
  {
    id: "d7",
    name: "Dr. Elena Rostova",
    specialty: "Oncology", // Edge: Rare specialty, only one in the array
    hospitalId: "h6",
    hospitalName: "Pioneer Medical City",
    availableToday: false, // Edge: Unavailable
    timings: "08:00 AM - 12:00 PM",
    fees: 3500, // Edge: Unusually high fee
    nextAvailable: "Next Monday, 08:00 AM" // Edge: Long wait time format
  }
];