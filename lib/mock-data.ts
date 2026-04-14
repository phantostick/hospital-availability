export interface Hospital {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  distance: number; // computed at runtime from geolocation
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

// Real Visakhapatnam hospitals with actual coordinates
export const mockHospitals: Hospital[] = [
  {
    id: "h1",
    name: "King George Hospital",
    location: "Maharani Peta, Visakhapatnam",
    lat: 17.7231,
    lng: 83.3012,
    distance: 0,
    lastUpdatedMinutes: 3,
    availableBeds: { general: 45, icu: 8, ventilator: 4 },
    totalBeds: { general: 500, icu: 60, ventilator: 30 },
    contact: "+91 891 278 0100",
    specialties: ["cardiac", "neuro", "trauma", "general"]
  },
  {
    id: "h2",
    name: "GITAM Institute of Medical Sciences",
    location: "Rushikonda, Visakhapatnam",
    lat: 17.7808,
    lng: 83.3678,
    distance: 0,
    lastUpdatedMinutes: 12,
    availableBeds: { general: 28, icu: 5, ventilator: 3 },
    totalBeds: { general: 200, icu: 30, ventilator: 12 },
    contact: "+91 891 284 0100",
    specialties: ["cardiac", "general", "trauma"]
  },
  {
    id: "h3",
    name: "Visakha Institute of Medical Sciences (VIMS)",
    location: "Maharani Peta, Visakhapatnam",
    lat: 17.7199,
    lng: 83.2985,
    distance: 0,
    lastUpdatedMinutes: 5,
    availableBeds: { general: 18, icu: 4, ventilator: 2 },
    totalBeds: { general: 180, icu: 24, ventilator: 10 },
    contact: "+91 891 256 3000",
    specialties: ["cardiac", "neuro", "general"]
  },
  {
    id: "h4",
    name: "Seven Hills Hospital",
    location: "Rockdale Layout, Visakhapatnam",
    lat: 17.7268,
    lng: 83.3185,
    distance: 0,
    lastUpdatedMinutes: 8,
    availableBeds: { general: 32, icu: 9, ventilator: 5 },
    totalBeds: { general: 250, icu: 40, ventilator: 18 },
    contact: "+91 891 251 1111",
    specialties: ["cardiac", "neuro", "trauma", "general"]
  },
  {
    id: "h5",
    name: "Appolo Hospitals Visakhapatnam",
    location: "Waltair Main Road, Visakhapatnam",
    lat: 17.7326,
    lng: 83.3247,
    distance: 0,
    lastUpdatedMinutes: 2,
    availableBeds: { general: 40, icu: 12, ventilator: 6 },
    totalBeds: { general: 300, icu: 50, ventilator: 20 },
    contact: "+91 891 670 7777",
    specialties: ["cardiac", "neuro", "trauma", "general"]
  },
  {
    id: "h6",
    name: "Care Hospital",
    location: "Ramnagar, Visakhapatnam",
    lat: 17.7398,
    lng: 83.3152,
    distance: 0,
    lastUpdatedMinutes: 15,
    availableBeds: { general: 22, icu: 6, ventilator: 2 },
    totalBeds: { general: 200, icu: 35, ventilator: 14 },
    contact: "+91 891 666 5555",
    specialties: ["cardiac", "general"]
  },
  {
    id: "h7",
    name: "Medicover Hospitals",
    location: "Siripuram, Visakhapatnam",
    lat: 17.7352,
    lng: 83.3301,
    distance: 0,
    lastUpdatedMinutes: 6,
    availableBeds: { general: 15, icu: 3, ventilator: 1 },
    totalBeds: { general: 120, icu: 20, ventilator: 8 },
    contact: "+91 891 680 0000",
    specialties: ["general", "trauma"]
  },
  {
    id: "h8",
    name: "Gayatri Vidya Parishad Hospital",
    location: "Kommadi, Visakhapatnam",
    lat: 17.7901,
    lng: 83.3845,
    distance: 0,
    lastUpdatedMinutes: 20,
    availableBeds: { general: 10, icu: 2, ventilator: 1 },
    totalBeds: { general: 100, icu: 15, ventilator: 6 },
    contact: "+91 891 275 0100",
    specialties: ["general"]
  },
  {
    id: "h9",
    name: "Bheemunipatnam Government Hospital",
    location: "Bheemunipatnam, Visakhapatnam",
    lat: 17.8899,
    lng: 83.4527,
    distance: 0,
    lastUpdatedMinutes: 45,
    availableBeds: { general: 8, icu: 1, ventilator: 0 },
    totalBeds: { general: 80, icu: 10, ventilator: 4 },
    contact: "+91 891 245 0100",
    specialties: ["general"]
  },
  {
    id: "h10",
    name: "Ramakrishna Hospital",
    location: "Maharanipeta, Visakhapatnam",
    lat: 17.7215,
    lng: 83.3028,
    distance: 0,
    lastUpdatedMinutes: 10,
    availableBeds: { general: 25, icu: 5, ventilator: 2 },
    totalBeds: { general: 150, icu: 25, ventilator: 10 },
    contact: "+91 891 255 0110",
    specialties: ["cardiac", "general", "trauma"]
  },
  {
    id: "h11",
    name: "NRI Institute of Medical Sciences",
    location: "Sangivalasa, Visakhapatnam",
    lat: 17.8123,
    lng: 83.4012,
    distance: 0,
    lastUpdatedMinutes: 18,
    availableBeds: { general: 35, icu: 7, ventilator: 3 },
    totalBeds: { general: 220, icu: 32, ventilator: 12 },
    contact: "+91 891 278 9000",
    specialties: ["cardiac", "neuro", "general"]
  },
  {
    id: "h12",
    name: "Surya Hospital",
    location: "Dwaraka Nagar, Visakhapatnam",
    lat: 17.7291,
    lng: 83.3369,
    distance: 0,
    lastUpdatedMinutes: 30,
    availableBeds: { general: 12, icu: 0, ventilator: 0 },
    totalBeds: { general: 80, icu: 10, ventilator: 4 },
    contact: "+91 891 256 7890",
    specialties: ["general"]
  },
  {
    id: "h13",
    name: "Padmavathi Hospital",
    location: "Seethammadhara, Visakhapatnam",
    lat: 17.7441,
    lng: 83.3287,
    distance: 0,
    lastUpdatedMinutes: 25,
    availableBeds: { general: 20, icu: 4, ventilator: 1 },
    totalBeds: { general: 130, icu: 18, ventilator: 7 },
    contact: "+91 891 254 3210",
    specialties: ["general", "trauma"]
  },
  {
    id: "h14",
    name: "Aditya Hospital",
    location: "MVP Colony, Visakhapatnam",
    lat: 17.7517,
    lng: 83.3432,
    distance: 0,
    lastUpdatedMinutes: 14,
    availableBeds: { general: 18, icu: 3, ventilator: 2 },
    totalBeds: { general: 120, icu: 20, ventilator: 8 },
    contact: "+91 891 279 5555",
    specialties: ["cardiac", "general"]
  },
  {
    id: "h15",
    name: "Vizag Government District Hospital",
    location: "Gajuwaka, Visakhapatnam",
    lat: 17.6818,
    lng: 83.2143,
    distance: 0,
    lastUpdatedMinutes: 60,
    availableBeds: { general: 30, icu: 3, ventilator: 1 },
    totalBeds: { general: 300, icu: 30, ventilator: 10 },
    contact: "+91 891 258 4100",
    specialties: ["general", "trauma"]
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Venkata Rao Pasupuleti",
    specialty: "Cardiology",
    hospitalId: "h5",
    hospitalName: "Appolo Hospitals Visakhapatnam",
    availableToday: true,
    timings: "10:00 AM - 04:00 PM",
    fees: 800,
    nextAvailable: "Today, 10:30 AM"
  },
  {
    id: "d2",
    name: "Dr. Srinivasa Rao Naidu",
    specialty: "Neurology",
    hospitalId: "h4",
    hospitalName: "Seven Hills Hospital",
    availableToday: false,
    timings: "11:00 AM - 02:00 PM",
    fees: 1200,
    nextAvailable: "Tomorrow, 11:00 AM"
  },
  {
    id: "d3",
    name: "Dr. Lakshmi Prasanna",
    specialty: "Pediatrics",
    hospitalId: "h1",
    hospitalName: "King George Hospital",
    availableToday: true,
    timings: "09:00 AM - 01:00 PM",
    fees: 400,
    nextAvailable: "Today, 11:15 AM"
  },
  {
    id: "d4",
    name: "Dr. Murali Krishna Vadlamudi",
    specialty: "Orthopedics",
    hospitalId: "h4",
    hospitalName: "Seven Hills Hospital",
    availableToday: true,
    timings: "02:00 PM - 07:00 PM",
    fees: 900,
    nextAvailable: "Today, 02:00 PM"
  },
  {
    id: "d5",
    name: "Dr. Padmaja Reddy",
    specialty: "Cardiology",
    hospitalId: "h3",
    hospitalName: "Visakha Institute of Medical Sciences",
    availableToday: true,
    timings: "04:00 PM - 08:00 PM",
    fees: 1000,
    nextAvailable: "Today, 04:30 PM"
  },
  {
    id: "d6",
    name: "Dr. Subrahmanyam Rao",
    specialty: "Neurology",
    hospitalId: "h11",
    hospitalName: "NRI Institute of Medical Sciences",
    availableToday: true,
    timings: "06:00 PM - 10:00 PM",
    fees: 1100,
    nextAvailable: "Today, 06:15 PM"
  },
  {
    id: "d7",
    name: "Dr. Annapurna Devi",
    specialty: "Oncology",
    hospitalId: "h5",
    hospitalName: "Appolo Hospitals Visakhapatnam",
    availableToday: false,
    timings: "08:00 AM - 12:00 PM",
    fees: 1500,
    nextAvailable: "Next Monday, 08:00 AM"
  }
];