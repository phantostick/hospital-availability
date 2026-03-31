'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hospital } from '@/lib/mock-data';
import { AlertCircle, Phone, MapPin } from 'lucide-react';
import { BedStatus } from './bed-status';

interface HospitalCardProps {
  hospital: Hospital;
}

export function HospitalCard({ hospital }: HospitalCardProps) {
  const bedsAvailable = hospital.beds.generalAvailable > 0;
  const icuAvailable = hospital.beds.icuAvailable > 0;

  return (
    <Link href={`/hospital/${hospital.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-lg text-gray-900">{hospital.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                <MapPin className="w-4 h-4" />
                {hospital.address}
              </div>
            </div>
            {hospital.emergencyServices && (
              <Badge className="bg-red-100 text-red-700 border-0">Emergency</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <BedStatus type="General" available={hospital.beds.generalAvailable} total={hospital.beds.general} />
            <BedStatus type="ICU" available={hospital.beds.icuAvailable} total={hospital.beds.icu} />
            <BedStatus type="Ventilator" available={hospital.beds.ventilatorAvailable} total={hospital.beds.ventilator} />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 pt-2 border-t">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{hospital.phone}</span>
          </div>

          <div className="flex gap-2 pt-2">
            {!bedsAvailable && !icuAvailable && (
              <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                <AlertCircle className="w-3 h-3" />
                Beds Limited
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
