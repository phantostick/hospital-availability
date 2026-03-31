'use client';

import { mockHospitals } from '@/lib/mock-data';
import { BedStatus } from '@/components/bed-status';
import { EmergencySOS } from '@/components/emergency-sos';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function HospitalDetail() {
  const params = useParams();
  const hospital = mockHospitals.find(h => h.id === params.id);

  if (!hospital) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Hospital not found</h1>
            <Link href="/">
              <Button className="mt-4">Back to Search</Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  const totalBedsAvailable = hospital.availableBeds.general + hospital.availableBeds.icu + hospital.availableBeds.ventilator;
  const totalBeds = hospital.totalBeds.general + hospital.totalBeds.icu + hospital.totalBeds.ventilator;
  const isFresh = hospital.lastUpdatedMinutes < 10;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          {/* Back Button */}
          <Link href="/">
            <Button variant="outline">← Back to Search</Button>
          </Link>

          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl text-gray-900">{hospital.name}</CardTitle>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <MapPin className="w-5 h-5" />
                    <span>{hospital.location} • {hospital.distance} km away</span>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-700 border-0 text-sm">24/7 Emergency</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{hospital.contact}</span>
              </div>

              {/* Data Freshness Indicator */}
              <div className="flex items-center text-sm font-medium mt-1">
                <Clock className={`h-4 w-4 mr-2 ${isFresh ? 'text-green-600' : 'text-orange-500'}`} />
                <span className={isFresh ? 'text-green-600' : 'text-orange-500'}>
                  Data updated {hospital.lastUpdatedMinutes} mins ago
                </span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t mt-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Total Available</p>
                  <p className="text-2xl font-bold text-green-600">{totalBedsAvailable}/{totalBeds}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Availability Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{Math.round((totalBedsAvailable / totalBeds) * 100)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bed Availability Details */}
          <Card>
            <CardHeader>
              <CardTitle>Bed Availability</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <BedStatus
                  type="General Ward Beds"
                  available={hospital.availableBeds.general}
                  total={hospital.totalBeds.general}
                />
              </div>

              <div>
                <BedStatus
                  type="ICU Beds"
                  available={hospital.availableBeds.icu}
                  total={hospital.totalBeds.icu}
                />
              </div>

              <div>
                <BedStatus
                  type="Ventilator Support"
                  available={hospital.availableBeds.ventilator}
                  total={hospital.totalBeds.ventilator}
                />
              </div>
            </CardContent>
          </Card>

          {/* Services Info */}
          <Card>
            <CardHeader>
              <CardTitle>Services Available</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">
                  24/7 Emergency Services Available
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Booking Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900">Note</p>
              <p className="text-sm text-blue-800 mt-1">
                Contact the hospital directly on the number provided above to check current availability and make a booking.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Make sure EmergencySOS doesn't rely on the old mock data! */}
      <EmergencySOS /> 
    </>
  );
}