'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HospitalCard } from '@/components/hospital-card';
import { EmergencySOS } from '@/components/emergency-sos';
import { Navbar } from '@/components/navbar';
import { hospitals } from '@/lib/mock-data';
import { Search, Filter } from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'emergency' | 'availability'>('all');

  const filteredHospitals = useMemo(() => {
    return hospitals.filter(hospital => {
      const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterType === 'emergency') {
        return matchesSearch && hospital.emergencyServices;
      }
      if (filterType === 'availability') {
        return matchesSearch && (hospital.beds.generalAvailable > 0 || hospital.beds.icuAvailable > 0);
      }

      return matchesSearch;
    });
  }, [searchTerm, filterType]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Find Hospital Beds</h1>
            <p className="text-gray-600">Search and locate available beds across hospitals</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by hospital name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
              size="sm"
              className="gap-1"
            >
              <Filter className="w-4 h-4" />
              All
            </Button>
            <Button
              variant={filterType === 'emergency' ? 'default' : 'outline'}
              onClick={() => setFilterType('emergency')}
              size="sm"
            >
              Emergency Services
            </Button>
            <Button
              variant={filterType === 'availability' ? 'default' : 'outline'}
              onClick={() => setFilterType('availability')}
              size="sm"
            >
              Available Beds
            </Button>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-600 font-medium">
            {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? 's' : ''} found
          </p>

          {/* Hospital Grid */}
          <div className="grid gap-4">
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map(hospital => (
                <HospitalCard key={hospital.id} hospital={hospital} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600 font-medium">No hospitals found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <EmergencySOS />
    </>
  );
}
