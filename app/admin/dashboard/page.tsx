'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { hospitals } from '@/lib/mock-data';
import { BedStatus } from '@/components/bed-status';
import { Edit2, Save, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hospitalData, setHospitalData] = useState(hospitals);
  const [editValues, setEditValues] = useState<any>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleEdit = (hospitalId: string) => {
    const hospital = hospitalData.find(h => h.id === hospitalId);
    if (hospital) {
      setEditingId(hospitalId);
      setEditValues({ ...hospital.beds });
    }
  };

  const handleSave = (hospitalId: string) => {
    const updatedData = hospitalData.map(h => 
      h.id === hospitalId 
        ? { ...h, beds: editValues }
        : h
    );
    setHospitalData(updatedData);
    setEditingId(null);
    setEditValues(null);
    toast.success('Hospital data updated successfully');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues(null);
  };

  const handleInputChange = (field: string, value: number) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage hospital bed availability</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Hospitals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{hospitalData.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">General Beds Available</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {hospitalData.reduce((sum, h) => sum + h.beds.generalAvailable, 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">ICU Beds Available</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">
                  {hospitalData.reduce((sum, h) => sum + h.beds.icuAvailable, 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ventilators Available</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">
                  {hospitalData.reduce((sum, h) => sum + h.beds.ventilatorAvailable, 0)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Hospital List */}
          <div className="space-y-4">
            {hospitalData.map(hospital => (
              <Card key={hospital.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{hospital.name}</CardTitle>
                    {editingId !== hospital.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(hospital.id)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {editingId === hospital.id && editValues ? (
                    // Edit Mode
                    <div className="space-y-6 bg-blue-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* General Beds */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">General - Available</label>
                          <Input
                            type="number"
                            min="0"
                            max={hospital.beds.general}
                            value={editValues.generalAvailable}
                            onChange={(e) => handleInputChange('generalAvailable', parseInt(e.target.value))}
                          />
                          <p className="text-xs text-gray-600">Total: {hospital.beds.general}</p>
                        </div>

                        {/* ICU Beds */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">ICU - Available</label>
                          <Input
                            type="number"
                            min="0"
                            max={hospital.beds.icu}
                            value={editValues.icuAvailable}
                            onChange={(e) => handleInputChange('icuAvailable', parseInt(e.target.value))}
                          />
                          <p className="text-xs text-gray-600">Total: {hospital.beds.icu}</p>
                        </div>

                        {/* Ventilator */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Ventilator - Available</label>
                          <Input
                            type="number"
                            min="0"
                            max={hospital.beds.ventilator}
                            value={editValues.ventilatorAvailable}
                            onChange={(e) => handleInputChange('ventilatorAvailable', parseInt(e.target.value))}
                          />
                          <p className="text-xs text-gray-600">Total: {hospital.beds.ventilator}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave(hospital.id)}
                          size="sm"
                          className="gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          size="sm"
                          className="gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <BedStatus
                        type="General Beds"
                        available={hospital.beds.generalAvailable}
                        total={hospital.beds.general}
                      />
                      <BedStatus
                        type="ICU Beds"
                        available={hospital.beds.icuAvailable}
                        total={hospital.beds.icu}
                      />
                      <BedStatus
                        type="Ventilator Support"
                        available={hospital.beds.ventilatorAvailable}
                        total={hospital.beds.ventilator}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-900">Data Note</p>
              <p className="text-sm text-amber-800 mt-1">
                This is a prototype dashboard. Changes are stored locally and will reset on page reload.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
