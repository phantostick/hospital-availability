import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Phone, Activity } from "lucide-react"
import { Hospital } from "@/lib/mock-data"
import Link from "next/link"

export function HospitalCard({ hospital, isOptimal = false }: { hospital: Hospital, isOptimal?: boolean }) {
  // Determine if data is fresh (updated < 10 mins ago)
  const isFresh = hospital.lastUpdatedMinutes < 10;

  return (
    <Link href={`/hospital/${hospital.id}`}>
      <Card className={`hover:shadow-lg transition-all border-2 ${isOptimal ? 'border-red-500 shadow-red-100' : 'border-transparent hover:border-gray-200'}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              {isOptimal && (
                <Badge className="bg-red-500 hover:bg-red-600 mb-2 font-bold animate-pulse">
                  ★ Best Emergency Match
                </Badge>
              )}
              <CardTitle className="text-xl font-bold text-gray-900">{hospital.name}</CardTitle>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {hospital.location} • <span className="font-semibold ml-1 text-gray-700">{hospital.distance} km away</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm mb-4 font-medium">
            <Clock className={`h-4 w-4 mr-1 ${isFresh ? 'text-green-600' : 'text-orange-500'}`} />
            <span className={isFresh ? 'text-green-600' : 'text-orange-500'}>
              Updated {hospital.lastUpdatedMinutes} mins ago
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-xs text-blue-600 font-semibold mb-1">GENERAL</p>
              <p className="text-2xl font-bold text-blue-900">{hospital.availableBeds.general}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <p className="text-xs text-red-600 font-semibold mb-1">ICU</p>
              <p className="text-2xl font-bold text-red-900">{hospital.availableBeds.icu}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-xs text-purple-600 font-semibold mb-1">VENTILATOR</p>
              <p className="text-2xl font-bold text-purple-900">{hospital.availableBeds.ventilator}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}