// ─────────────────────────────────────────────────────────────────────────────
// SPECIALTY KEY  →  which symptoms map to each specialty tag
//
//  "cardiac"     → Chest pain, Heart palpitations, Irregular heartbeat,
//                   Difficulty breathing, Cardiac arrest
//  "neuro"       → Stroke (FAST), Severe headache, Seizure,
//                   Loss of consciousness, Memory loss / confusion
//  "trauma"      → Fracture / fall, Heavy bleeding, Road accident,
//                   Spinal injury, Crush injury
//  "burns"       → Burns (minor/major), Chemical burns, Electrical injury,
//                   Inhalation injury
//  "oncology"    → Cancer-related pain, Chemo side effects,
//                   Unexplained weight loss / lumps, Palliative care
//  "maternity"   → Pregnancy emergency, Labour pain, Miscarriage,
//                   Postpartum complications
//  "pediatric"   → Child fever / convulsion, Infant breathing difficulty,
//                   Child poisoning / accidental ingestion, Neonatal emergency
//  "eye"         → Eye injury / chemical splash, Sudden vision loss,
//                   Eye infection / pain, Glaucoma attack, Retinal emergency
//  "ortho"       → Bone fracture, Joint dislocation, Severe back pain,
//                   Sports injury, Ligament tear
//  "renal"       → Kidney stone / severe flank pain, Urinary retention,
//                   Dialysis emergency, Acute kidney failure, Blood in urine
//  "psychiatric" → Suicidal ideation / self-harm, Acute psychosis,
//                   Severe anxiety / panic attack, Substance withdrawal,
//                   Bipolar crisis
//  "general"     → High fever, Severe vomiting / poisoning, Drug overdose,
//                   Severe allergic reaction, Ear / throat emergency,
//                   Diabetic emergency
// ─────────────────────────────────────────────────────────────────────────────

export interface Hospital {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  distance: number;          // computed at runtime via Haversine
  lastUpdatedMinutes: number;
  lastUpdatedAt?: number;
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
  specialties: string[];
  type: 'general' | 'specialized' | 'government';
  specialtyLabel?: string;
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

// ─── HOSPITALS ───────────────────────────────────────────────────────────────

export const mockHospitals: Hospital[] = [

  // ── LARGE MULTI-SPECIALTY ─────────────────────────────────────────────────

  {
    id: "h1",
    name: "King George Hospital",
    location: "Maharani Peta, Visakhapatnam",
    lat: 17.7231, lng: 83.3012, distance: 0,
    lastUpdatedMinutes: 3,
    availableBeds: { general: 60, icu: 10, ventilator: 5 },
    totalBeds: { general: 600, icu: 80, ventilator: 35 },
    contact: "+91 891 278 0100",
    specialties: ["cardiac", "neuro", "trauma", "burns", "pediatric", "maternity", "general"],
    type: "government",
  },
  {
    id: "h2",
    name: "GITAM Institute of Medical Sciences",
    location: "Rushikonda, Visakhapatnam",
    lat: 17.7808, lng: 83.3678, distance: 0,
    lastUpdatedMinutes: 12,
    availableBeds: { general: 28, icu: 5, ventilator: 3 },
    totalBeds: { general: 200, icu: 30, ventilator: 12 },
    contact: "+91 891 284 0100",
    specialties: ["cardiac", "general", "trauma", "ortho"],
    type: "general",
  },
  {
    id: "h3",
    name: "Visakha Institute of Medical Sciences (VIMS)",
    location: "Maharani Peta, Visakhapatnam",
    lat: 17.7199, lng: 83.2985, distance: 0,
    lastUpdatedMinutes: 5,
    availableBeds: { general: 18, icu: 4, ventilator: 2 },
    totalBeds: { general: 180, icu: 24, ventilator: 10 },
    contact: "+91 891 256 3000",
    specialties: ["cardiac", "neuro", "general", "renal"],
    type: "general",
  },
  {
    id: "h4",
    name: "Seven Hills Hospital",
    location: "Rockdale Layout, Visakhapatnam",
    lat: 17.7268, lng: 83.3185, distance: 0,
    lastUpdatedMinutes: 8,
    availableBeds: { general: 32, icu: 9, ventilator: 5 },
    totalBeds: { general: 250, icu: 40, ventilator: 18 },
    contact: "+91 891 251 1111",
    specialties: ["cardiac", "neuro", "trauma", "ortho", "general"],
    type: "general",
  },
  {
    id: "h5",
    name: "Apollo Hospitals Visakhapatnam",
    location: "Waltair Main Road, Visakhapatnam",
    lat: 17.7326, lng: 83.3247, distance: 0,
    lastUpdatedMinutes: 2,
    availableBeds: { general: 40, icu: 12, ventilator: 6 },
    totalBeds: { general: 300, icu: 50, ventilator: 20 },
    contact: "+91 891 670 7777",
    specialties: ["cardiac", "neuro", "trauma", "oncology", "ortho", "general"],
    type: "general",
  },
  {
    id: "h6",
    name: "Care Hospital",
    location: "Ramnagar, Visakhapatnam",
    lat: 17.7398, lng: 83.3152, distance: 0,
    lastUpdatedMinutes: 15,
    availableBeds: { general: 22, icu: 6, ventilator: 2 },
    totalBeds: { general: 200, icu: 35, ventilator: 14 },
    contact: "+91 891 666 5555",
    specialties: ["cardiac", "general", "renal"],
    type: "general",
  },
  {
    id: "h7",
    name: "Medicover Hospitals",
    location: "Siripuram, Visakhapatnam",
    lat: 17.7352, lng: 83.3301, distance: 0,
    lastUpdatedMinutes: 6,
    availableBeds: { general: 15, icu: 3, ventilator: 1 },
    totalBeds: { general: 120, icu: 20, ventilator: 8 },
    contact: "+91 891 680 0000",
    specialties: ["general", "trauma", "ortho"],
    type: "general",
  },
  {
    id: "h8",
    name: "Gayatri Vidya Parishad Hospital",
    location: "Kommadi, Visakhapatnam",
    lat: 17.7901, lng: 83.3845, distance: 0,
    lastUpdatedMinutes: 20,
    availableBeds: { general: 10, icu: 2, ventilator: 1 },
    totalBeds: { general: 100, icu: 15, ventilator: 6 },
    contact: "+91 891 275 0100",
    specialties: ["general", "pediatric"],
    type: "general",
  },
  {
    id: "h9",
    name: "Bheemunipatnam Government Hospital",
    location: "Bheemunipatnam, Visakhapatnam",
    lat: 17.8899, lng: 83.4527, distance: 0,
    lastUpdatedMinutes: 45,
    availableBeds: { general: 8, icu: 1, ventilator: 0 },
    totalBeds: { general: 80, icu: 10, ventilator: 4 },
    contact: "+91 891 245 0100",
    specialties: ["general"],
    type: "government",
  },
  {
    id: "h10",
    name: "Ramakrishna Hospital",
    location: "Maharanipeta, Visakhapatnam",
    lat: 17.7215, lng: 83.3028, distance: 0,
    lastUpdatedMinutes: 10,
    availableBeds: { general: 25, icu: 5, ventilator: 2 },
    totalBeds: { general: 150, icu: 25, ventilator: 10 },
    contact: "+91 891 255 0110",
    specialties: ["cardiac", "general", "trauma", "maternity"],
    type: "general",
  },
  {
    id: "h11",
    name: "NRI Institute of Medical Sciences",
    location: "Sangivalasa, Visakhapatnam",
    lat: 17.8123, lng: 83.4012, distance: 0,
    lastUpdatedMinutes: 18,
    availableBeds: { general: 35, icu: 7, ventilator: 3 },
    totalBeds: { general: 220, icu: 32, ventilator: 12 },
    contact: "+91 891 278 9000",
    specialties: ["cardiac", "neuro", "general", "renal"],
    type: "general",
  },
  {
    id: "h12",
    name: "Surya Hospital",
    location: "Dwaraka Nagar, Visakhapatnam",
    lat: 17.7291, lng: 83.3369, distance: 0,
    lastUpdatedMinutes: 30,
    availableBeds: { general: 12, icu: 0, ventilator: 0 },
    totalBeds: { general: 80, icu: 10, ventilator: 4 },
    contact: "+91 891 256 7890",
    specialties: ["general", "maternity"],
    type: "general",
  },
  {
    id: "h13",
    name: "Padmavathi Hospital",
    location: "Seethammadhara, Visakhapatnam",
    lat: 17.7441, lng: 83.3287, distance: 0,
    lastUpdatedMinutes: 25,
    availableBeds: { general: 20, icu: 4, ventilator: 1 },
    totalBeds: { general: 130, icu: 18, ventilator: 7 },
    contact: "+91 891 254 3210",
    specialties: ["general", "trauma", "maternity"],
    type: "general",
  },
  {
    id: "h14",
    name: "Aditya Hospital",
    location: "MVP Colony, Visakhapatnam",
    lat: 17.7517, lng: 83.3432, distance: 0,
    lastUpdatedMinutes: 14,
    availableBeds: { general: 18, icu: 3, ventilator: 2 },
    totalBeds: { general: 120, icu: 20, ventilator: 8 },
    contact: "+91 891 279 5555",
    specialties: ["cardiac", "general", "ortho"],
    type: "general",
  },
  {
    id: "h15",
    name: "Vizag Government District Hospital",
    location: "Gajuwaka, Visakhapatnam",
    lat: 17.6818, lng: 83.2143, distance: 0,
    lastUpdatedMinutes: 60,
    availableBeds: { general: 30, icu: 3, ventilator: 1 },
    totalBeds: { general: 300, icu: 30, ventilator: 10 },
    contact: "+91 891 258 4100",
    specialties: ["general", "trauma", "maternity"],
    type: "government",
  },

  // ── CARDIAC SPECIALIST ────────────────────────────────────────────────────

  {
    id: "h16",
    name: "Visakha Heart Centre",
    location: "Dwaraka Nagar, Visakhapatnam",
    lat: 17.7285, lng: 83.3350, distance: 0,
    lastUpdatedMinutes: 4,
    availableBeds: { general: 14, icu: 8, ventilator: 5 },
    totalBeds: { general: 60, icu: 30, ventilator: 15 },
    contact: "+91 891 256 9900",
    specialties: ["cardiac"],
    type: "specialized",
    specialtyLabel: "Cardiac Centre",
  },
  {
    id: "h17",
    name: "Cardio Care Hospital",
    location: "Waltair Uplands, Visakhapatnam",
    lat: 17.7360, lng: 83.3270, distance: 0,
    lastUpdatedMinutes: 9,
    availableBeds: { general: 10, icu: 6, ventilator: 3 },
    totalBeds: { general: 50, icu: 20, ventilator: 10 },
    contact: "+91 891 279 3311",
    specialties: ["cardiac"],
    type: "specialized",
    specialtyLabel: "Cardiac Centre",
  },

  // ── NEURO SPECIALIST ──────────────────────────────────────────────────────

  {
    id: "h18",
    name: "Vizag Neuro & Spine Hospital",
    location: "Jagadamba Junction, Visakhapatnam",
    lat: 17.7244, lng: 83.3143, distance: 0,
    lastUpdatedMinutes: 7,
    availableBeds: { general: 16, icu: 6, ventilator: 3 },
    totalBeds: { general: 80, icu: 20, ventilator: 10 },
    contact: "+91 891 258 7700",
    specialties: ["neuro"],
    type: "specialized",
    specialtyLabel: "Neuro & Spine Centre",
  },

  // ── ONCOLOGY ─────────────────────────────────────────────────────────────

  {
    id: "h19",
    name: "Vizag Cancer Hospital & Research Centre",
    location: "Maharani Peta, Visakhapatnam",
    lat: 17.7220, lng: 83.3005, distance: 0,
    lastUpdatedMinutes: 22,
    availableBeds: { general: 20, icu: 4, ventilator: 2 },
    totalBeds: { general: 120, icu: 18, ventilator: 8 },
    contact: "+91 891 256 1122",
    specialties: ["oncology"],
    type: "specialized",
    specialtyLabel: "Cancer Institute",
  },
  {
    id: "h20",
    name: "Omega Hospitals",
    location: "Seethammadhara, Visakhapatnam",
    lat: 17.7450, lng: 83.3295, distance: 0,
    lastUpdatedMinutes: 35,
    availableBeds: { general: 15, icu: 3, ventilator: 1 },
    totalBeds: { general: 80, icu: 12, ventilator: 5 },
    contact: "+91 891 277 4400",
    specialties: ["oncology"],
    type: "specialized",
    specialtyLabel: "Cancer Institute",
  },

  // ── MATERNITY & WOMEN ─────────────────────────────────────────────────────

  {
    id: "h21",
    name: "Ankura Hospital for Women & Children",
    location: "Siripuram, Visakhapatnam",
    lat: 17.7345, lng: 83.3310, distance: 0,
    lastUpdatedMinutes: 8,
    availableBeds: { general: 22, icu: 5, ventilator: 2 },
    totalBeds: { general: 100, icu: 15, ventilator: 6 },
    contact: "+91 891 680 5555",
    specialties: ["maternity", "pediatric"],
    type: "specialized",
    specialtyLabel: "Women & Children's Hospital",
  },
  {
    id: "h22",
    name: "Fernandez Hospital",
    location: "Dwaraka Nagar, Visakhapatnam",
    lat: 17.7300, lng: 83.3380, distance: 0,
    lastUpdatedMinutes: 11,
    availableBeds: { general: 18, icu: 4, ventilator: 1 },
    totalBeds: { general: 80, icu: 10, ventilator: 4 },
    contact: "+91 891 254 8800",
    specialties: ["maternity"],
    type: "specialized",
    specialtyLabel: "Maternity Hospital",
  },

  // ── PAEDIATRIC ────────────────────────────────────────────────────────────

  {
    id: "h23",
    name: "Rainbow Children's Hospital",
    location: "MVP Colony, Visakhapatnam",
    lat: 17.7530, lng: 83.3420, distance: 0,
    lastUpdatedMinutes: 6,
    availableBeds: { general: 20, icu: 6, ventilator: 3 },
    totalBeds: { general: 100, icu: 20, ventilator: 10 },
    contact: "+91 891 279 6600",
    specialties: ["pediatric"],
    type: "specialized",
    specialtyLabel: "Children's Hospital",
  },

  // ── EYE ──────────────────────────────────────────────────────────────────

  {
    id: "h24",
    name: "Sarojini Eye Hospital",
    location: "Suryabagh, Visakhapatnam",
    lat: 17.7190, lng: 83.3060, distance: 0,
    lastUpdatedMinutes: 17,
    availableBeds: { general: 12, icu: 0, ventilator: 0 },
    totalBeds: { general: 50, icu: 0, ventilator: 0 },
    contact: "+91 891 255 7788",
    specialties: ["eye"],
    type: "specialized",
    specialtyLabel: "Eye Hospital",
  },
  {
    id: "h25",
    name: "LV Prasad Eye Institute — Vizag",
    location: "Hanumanthawaka Junction, Visakhapatnam",
    lat: 17.7260, lng: 83.3120, distance: 0,
    lastUpdatedMinutes: 5,
    availableBeds: { general: 18, icu: 0, ventilator: 0 },
    totalBeds: { general: 80, icu: 0, ventilator: 0 },
    contact: "+91 891 258 4000",
    specialties: ["eye"],
    type: "specialized",
    specialtyLabel: "Eye Institute",
  },

  // ── ORTHOPAEDICS ─────────────────────────────────────────────────────────

  {
    id: "h26",
    name: "Srikara Orthopaedic Hospital",
    location: "Akkayyapalem, Visakhapatnam",
    lat: 17.7395, lng: 83.3088, distance: 0,
    lastUpdatedMinutes: 13,
    availableBeds: { general: 16, icu: 2, ventilator: 0 },
    totalBeds: { general: 70, icu: 6, ventilator: 2 },
    contact: "+91 891 274 3300",
    specialties: ["ortho", "trauma"],
    type: "specialized",
    specialtyLabel: "Orthopaedic Centre",
  },
  {
    id: "h27",
    name: "Vizag Bone & Joint Hospital",
    location: "Gopalapatnam, Visakhapatnam",
    lat: 17.7620, lng: 83.2950, distance: 0,
    lastUpdatedMinutes: 28,
    availableBeds: { general: 10, icu: 1, ventilator: 0 },
    totalBeds: { general: 50, icu: 4, ventilator: 1 },
    contact: "+91 891 279 0044",
    specialties: ["ortho"],
    type: "specialized",
    specialtyLabel: "Orthopaedic Centre",
  },

  // ── BURNS ────────────────────────────────────────────────────────────────

  {
    id: "h28",
    name: "VIMSAR Burns & Plastic Surgery Unit",
    location: "Maharani Peta, Visakhapatnam",
    lat: 17.7210, lng: 83.3000, distance: 0,
    lastUpdatedMinutes: 16,
    availableBeds: { general: 10, icu: 4, ventilator: 2 },
    totalBeds: { general: 40, icu: 12, ventilator: 6 },
    contact: "+91 891 256 3010",
    specialties: ["burns", "trauma"],
    type: "specialized",
    specialtyLabel: "Burns & Plastics Unit",
  },

  // ── RENAL ─────────────────────────────────────────────────────────────────

  {
    id: "h29",
    name: "Vizag Kidney Centre",
    location: "Maddilapalem, Visakhapatnam",
    lat: 17.7480, lng: 83.3200, distance: 0,
    lastUpdatedMinutes: 19,
    availableBeds: { general: 14, icu: 3, ventilator: 1 },
    totalBeds: { general: 60, icu: 10, ventilator: 4 },
    contact: "+91 891 271 9900",
    specialties: ["renal"],
    type: "specialized",
    specialtyLabel: "Kidney & Dialysis Centre",
  },
  {
    id: "h30",
    name: "Nephro Plus Dialysis Centre",
    location: "Dwaraka Nagar, Visakhapatnam",
    lat: 17.7295, lng: 83.3355, distance: 0,
    lastUpdatedMinutes: 40,
    availableBeds: { general: 8, icu: 0, ventilator: 0 },
    totalBeds: { general: 30, icu: 0, ventilator: 0 },
    contact: "+91 891 255 0022",
    specialties: ["renal"],
    type: "specialized",
    specialtyLabel: "Dialysis Centre",
  },

  // ── PSYCHIATRIC ───────────────────────────────────────────────────────────

  {
    id: "h31",
    name: "Vizag Institute of Mental Health",
    location: "Jail Road, Visakhapatnam",
    lat: 17.7155, lng: 83.3050, distance: 0,
    lastUpdatedMinutes: 30,
    availableBeds: { general: 18, icu: 0, ventilator: 0 },
    totalBeds: { general: 80, icu: 0, ventilator: 0 },
    contact: "+91 891 256 3300",
    specialties: ["psychiatric"],
    type: "specialized",
    specialtyLabel: "Mental Health Centre",
  },
  {
    id: "h32",
    name: "Manasa Mental Health Clinic",
    location: "Seethammadhara, Visakhapatnam",
    lat: 17.7452, lng: 83.3275, distance: 0,
    lastUpdatedMinutes: 50,
    availableBeds: { general: 10, icu: 0, ventilator: 0 },
    totalBeds: { general: 30, icu: 0, ventilator: 0 },
    contact: "+91 891 244 7700",
    specialties: ["psychiatric"],
    type: "specialized",
    specialtyLabel: "Mental Health Centre",
  },

  // ── GOVERNMENT PERIPHERAL ─────────────────────────────────────────────────

  {
    id: "h33",
    name: "Gajuwaka Community Health Centre",
    location: "Gajuwaka, Visakhapatnam",
    lat: 17.6850, lng: 83.2200, distance: 0,
    lastUpdatedMinutes: 55,
    availableBeds: { general: 12, icu: 0, ventilator: 0 },
    totalBeds: { general: 60, icu: 0, ventilator: 0 },
    contact: "+91 891 258 4200",
    specialties: ["general"],
    type: "government",
  },
  {
    id: "h34",
    name: "Anakapalle Area Hospital",
    location: "Anakapalle, Visakhapatnam District",
    lat: 17.6913, lng: 82.9982, distance: 0,
    lastUpdatedMinutes: 70,
    availableBeds: { general: 20, icu: 1, ventilator: 0 },
    totalBeds: { general: 120, icu: 8, ventilator: 2 },
    contact: "+91 891 241 0100",
    specialties: ["general", "trauma"],
    type: "government",
  },
  {
    id: "h35",
    name: "Narsipatnam Government Hospital",
    location: "Narsipatnam, Visakhapatnam District",
    lat: 17.6651, lng: 82.6083, distance: 0,
    lastUpdatedMinutes: 90,
    availableBeds: { general: 15, icu: 1, ventilator: 0 },
    totalBeds: { general: 80, icu: 5, ventilator: 1 },
    contact: "+91 891 248 0100",
    specialties: ["general"],
    type: "government",
  },
];

// ─── DOCTORS ─────────────────────────────────────────────────────────────────

export const mockDoctors: Doctor[] = [
  // Cardiology
  { id: "d1", name: "Dr. Venkata Rao Pasupuleti", specialty: "Cardiology", hospitalId: "h5", hospitalName: "Apollo Hospitals Visakhapatnam", availableToday: true, timings: "10:00 AM – 04:00 PM", fees: 800, nextAvailable: "Today, 10:30 AM" },
  { id: "d2", name: "Dr. Padmaja Reddy", specialty: "Cardiology", hospitalId: "h16", hospitalName: "Visakha Heart Centre", availableToday: true, timings: "09:00 AM – 01:00 PM", fees: 1000, nextAvailable: "Today, 09:30 AM" },
  { id: "d3", name: "Dr. Kishore Babu Ananthula", specialty: "Cardiology", hospitalId: "h17", hospitalName: "Cardio Care Hospital", availableToday: false, timings: "04:00 PM – 08:00 PM", fees: 900, nextAvailable: "Tomorrow, 04:00 PM" },

  // Neurology
  { id: "d4", name: "Dr. Srinivasa Rao Naidu", specialty: "Neurology", hospitalId: "h4", hospitalName: "Seven Hills Hospital", availableToday: false, timings: "11:00 AM – 02:00 PM", fees: 1200, nextAvailable: "Tomorrow, 11:00 AM" },
  { id: "d5", name: "Dr. Subrahmanyam Rao", specialty: "Neurology", hospitalId: "h18", hospitalName: "Vizag Neuro & Spine Hospital", availableToday: true, timings: "06:00 PM – 10:00 PM", fees: 1100, nextAvailable: "Today, 06:15 PM" },
  { id: "d6", name: "Dr. Hima Bindu Jonnalagadda", specialty: "Neurology", hospitalId: "h11", hospitalName: "NRI Institute of Medical Sciences", availableToday: true, timings: "08:00 AM – 12:00 PM", fees: 950, nextAvailable: "Today, 08:30 AM" },

  // Oncology
  { id: "d7", name: "Dr. Annapurna Devi", specialty: "Oncology", hospitalId: "h5", hospitalName: "Apollo Hospitals Visakhapatnam", availableToday: false, timings: "08:00 AM – 12:00 PM", fees: 1500, nextAvailable: "Next Monday, 08:00 AM" },
  { id: "d8", name: "Dr. Ravi Shankar Pemmaraju", specialty: "Oncology", hospitalId: "h19", hospitalName: "Vizag Cancer Hospital & Research Centre", availableToday: true, timings: "10:00 AM – 03:00 PM", fees: 1200, nextAvailable: "Today, 10:00 AM" },
  { id: "d9", name: "Dr. Vasantha Kumari Nalluri", specialty: "Oncology", hospitalId: "h20", hospitalName: "Omega Hospitals", availableToday: true, timings: "02:00 PM – 06:00 PM", fees: 1300, nextAvailable: "Today, 02:30 PM" },

  // Obstetrics & Gynaecology
  { id: "d10", name: "Dr. Sarada Devi Gottipati", specialty: "Obstetrics & Gynaecology", hospitalId: "h21", hospitalName: "Ankura Hospital for Women & Children", availableToday: true, timings: "09:00 AM – 05:00 PM", fees: 700, nextAvailable: "Today, 09:30 AM" },
  { id: "d11", name: "Dr. Swapna Latha Potluri", specialty: "Obstetrics & Gynaecology", hospitalId: "h22", hospitalName: "Fernandez Hospital", availableToday: true, timings: "07:00 AM – 11:00 AM", fees: 650, nextAvailable: "Today, 07:30 AM" },
  { id: "d12", name: "Dr. Ramya Bharathi Mulaparthi", specialty: "Obstetrics & Gynaecology", hospitalId: "h10", hospitalName: "Ramakrishna Hospital", availableToday: false, timings: "05:00 PM – 09:00 PM", fees: 750, nextAvailable: "Tomorrow, 05:00 PM" },

  // Paediatrics
  { id: "d13", name: "Dr. Lakshmi Prasanna Vemula", specialty: "Paediatrics", hospitalId: "h1", hospitalName: "King George Hospital", availableToday: true, timings: "09:00 AM – 01:00 PM", fees: 400, nextAvailable: "Today, 11:15 AM" },
  { id: "d14", name: "Dr. Surya Teja Duggirala", specialty: "Paediatrics", hospitalId: "h23", hospitalName: "Rainbow Children's Hospital", availableToday: true, timings: "10:00 AM – 06:00 PM", fees: 600, nextAvailable: "Today, 10:00 AM" },
  { id: "d15", name: "Dr. Naga Jyothi Kamaraju", specialty: "Paediatrics", hospitalId: "h21", hospitalName: "Ankura Hospital for Women & Children", availableToday: false, timings: "02:00 PM – 07:00 PM", fees: 550, nextAvailable: "Tomorrow, 02:00 PM" },

  // Ophthalmology
  { id: "d16", name: "Dr. Prabhakara Rao Karnati", specialty: "Ophthalmology", hospitalId: "h25", hospitalName: "LV Prasad Eye Institute — Vizag", availableToday: true, timings: "08:00 AM – 12:00 PM", fees: 800, nextAvailable: "Today, 08:00 AM" },
  { id: "d17", name: "Dr. Usha Kiran Mandava", specialty: "Ophthalmology", hospitalId: "h24", hospitalName: "Sarojini Eye Hospital", availableToday: true, timings: "10:00 AM – 04:00 PM", fees: 600, nextAvailable: "Today, 10:30 AM" },

  // Orthopaedics
  { id: "d18", name: "Dr. Murali Krishna Vadlamudi", specialty: "Orthopaedics", hospitalId: "h4", hospitalName: "Seven Hills Hospital", availableToday: true, timings: "02:00 PM – 07:00 PM", fees: 900, nextAvailable: "Today, 02:00 PM" },
  { id: "d19", name: "Dr. Phani Kumar Gorthi", specialty: "Orthopaedics", hospitalId: "h26", hospitalName: "Srikara Orthopaedic Hospital", availableToday: true, timings: "09:00 AM – 05:00 PM", fees: 850, nextAvailable: "Today, 09:00 AM" },
  { id: "d20", name: "Dr. Siva Rama Krishnam Raju", specialty: "Orthopaedics", hospitalId: "h27", hospitalName: "Vizag Bone & Joint Hospital", availableToday: false, timings: "03:00 PM – 07:00 PM", fees: 700, nextAvailable: "Tomorrow, 03:00 PM" },

  // Burns & Plastic Surgery
  { id: "d21", name: "Dr. Apparao Naidu Yenduri", specialty: "Burns & Plastic Surgery", hospitalId: "h28", hospitalName: "VIMSAR Burns & Plastic Surgery Unit", availableToday: true, timings: "08:00 AM – 02:00 PM", fees: 1000, nextAvailable: "Today, 08:00 AM" },

  // Nephrology
  { id: "d22", name: "Dr. Nageswara Rao Dugyala", specialty: "Nephrology", hospitalId: "h29", hospitalName: "Vizag Kidney Centre", availableToday: true, timings: "10:00 AM – 04:00 PM", fees: 950, nextAvailable: "Today, 10:00 AM" },
  { id: "d23", name: "Dr. Santha Kumari Yellepeddi", specialty: "Nephrology", hospitalId: "h11", hospitalName: "NRI Institute of Medical Sciences", availableToday: false, timings: "05:00 PM – 08:00 PM", fees: 900, nextAvailable: "Tomorrow, 05:00 PM" },

  // Psychiatry
  { id: "d24", name: "Dr. Satya Narayana Raju Veluri", specialty: "Psychiatry", hospitalId: "h31", hospitalName: "Vizag Institute of Mental Health", availableToday: true, timings: "09:00 AM – 01:00 PM", fees: 700, nextAvailable: "Today, 09:00 AM" },
  { id: "d25", name: "Dr. Manjula Devi Kottu", specialty: "Psychiatry", hospitalId: "h32", hospitalName: "Manasa Mental Health Clinic", availableToday: true, timings: "11:00 AM – 05:00 PM", fees: 600, nextAvailable: "Today, 11:00 AM" },

  // Emergency Medicine
  { id: "d26", name: "Dr. Rajendra Prasad Kolli", specialty: "Emergency Medicine", hospitalId: "h1", hospitalName: "King George Hospital", availableToday: true, timings: "24 hrs (On-call)", fees: 300, nextAvailable: "Now" },
  { id: "d27", name: "Dr. Bhanu Prakash Chaturvedula", specialty: "Emergency Medicine", hospitalId: "h5", hospitalName: "Apollo Hospitals Visakhapatnam", availableToday: true, timings: "24 hrs (On-call)", fees: 500, nextAvailable: "Now" },
];