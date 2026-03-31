export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  beds: {
    general: number;
    generalAvailable: number;
    icu: number;
    icuAvailable: number;
    ventilator: number;
    ventilatorAvailable: number;
  };
  emergencyServices: boolean;
  location: {
    lat: number;
    lng: number;
  };
}

export const hospitals: Hospital[] = [
  {
    id: '1',
    name: 'City General Hospital',
    address: '123 Main Street, Downtown',
    phone: '+91-98765-43210',
    beds: {
      general: 50,
      generalAvailable: 12,
      icu: 20,
      icuAvailable: 3,
      ventilator: 10,
      ventilatorAvailable: 1,
    },
    emergencyServices: true,
    location: { lat: 28.6139, lng: 77.2090 },
  },
  {
    id: '2',
    name: 'St. Mary Medical Center',
    address: '456 Oak Avenue, Midtown',
    phone: '+91-98765-43211',
    beds: {
      general: 80,
      generalAvailable: 45,
      icu: 25,
      icuAvailable: 8,
      ventilator: 15,
      ventilatorAvailable: 5,
    },
    emergencyServices: true,
    location: { lat: 28.6240, lng: 77.2280 },
  },
  {
    id: '3',
    name: 'Apollo Care Hospital',
    address: '789 Park Road, North Zone',
    phone: '+91-98765-43212',
    beds: {
      general: 60,
      generalAvailable: 8,
      icu: 18,
      icuAvailable: 1,
      ventilator: 12,
      ventilatorAvailable: 0,
    },
    emergencyServices: true,
    location: { lat: 28.6400, lng: 77.2100 },
  },
  {
    id: '4',
    name: 'Hope District Hospital',
    address: '321 Hospital Lane, South Wing',
    phone: '+91-98765-43213',
    beds: {
      general: 40,
      generalAvailable: 28,
      icu: 15,
      icuAvailable: 7,
      ventilator: 8,
      ventilatorAvailable: 4,
    },
    emergencyServices: false,
    location: { lat: 28.5940, lng: 77.2050 },
  },
  {
    id: '5',
    name: 'Regional Medical Institute',
    address: '555 Science Park, Tech Area',
    phone: '+91-98765-43214',
    beds: {
      general: 75,
      generalAvailable: 32,
      icu: 22,
      icuAvailable: 10,
      ventilator: 14,
      ventilatorAvailable: 6,
    },
    emergencyServices: true,
    location: { lat: 28.6500, lng: 77.2200 },
  },
];
