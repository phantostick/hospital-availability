'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockHospitals } from '@/lib/mock-data';
import { BedStatus } from '@/components/bed-status';
import { Edit2, Save, X, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hospitalData, setHospitalData] = useState<any[]>([]);
  const [editValues, setEditValues] = useState<any>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setMounted(true);
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) router.push('/admin/login');

    // Initialize data from LocalStorage or fallback to Mock Data
    const stored = localStorage.getItem('liveHospitals');
    if (stored) {
      setHospitalData(JSON.parse(stored));
    } else {
      // Map mock data to include absolute timestamps
      const initialData = mockHospitals.map(h => ({
        ...h,
        lastUpdatedAt: Date.now() - (h.lastUpdatedMinutes * 60000)
      }));
      setHospitalData(initialData);
      localStorage.setItem('liveHospitals', JSON.stringify(initialData));
    }

    // Tick every minute to update the "Minutes Ago" display
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, [router]);

  const handleEdit = (hospitalId: string) => {
    const hospital = hospitalData.find(h => h.id === hospitalId);
    if (hospital) {
      setEditingId(hospitalId);
      setEditValues({ ...hospital.availableBeds });
    }
  };

  const handleSave = (hospitalId: string) => {
    const updatedData = hospitalData.map(h => 
      h.id === hospitalId 
        ? { 
            ...h, 
            availableBeds: editValues,
            lastUpdatedAt: Date.now() // Set exact exact timestamp of update!
          }
        : h
    );
    setHospitalData(updatedData);
    localStorage.setItem('liveHospitals', JSON.stringify(updatedData));
    setEditingId(null);
    setEditValues(null);
    toast.success('Hospital capacity updated and timestamp refreshed!');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues(null);
  };

  const handleInputChange = (field: string, value: number) => {
    const safeValue = isNaN(value) ? 0 : value;
    setEditValues((prev: any) => ({ ...prev, [field]: safeValue }));
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 font-sans">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Control Center</h1>
            <p className="text-slate-600 mt-2">Manage live hospital telemetry</p>
          </div>

          <div className="space-y-4">
            {hospitalData.map(hospital => {
              // Calculate live staleness
              const stalenessMinutes = Math.floor((now - hospital.lastUpdatedAt) / 60000);
              const isStale = stalenessMinutes > 60;

              return (
                <Card key={hospital.id} className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg text-slate-900">{hospital.name}</CardTitle>
                        <div className="flex items-center mt-1 space-x-2 text-sm">
                          <Clock className={`w-4 h-4 ${isStale ? 'text-red-500' : 'text-emerald-500'}`} />
                          <span className={`${isStale ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
                            Last updated {stalenessMinutes} {stalenessMinutes === 1 ? 'minute' : 'minutes'} ago
                          </span>
                        </div>
                      </div>
                      {editingId !== hospital.id && (
                        <Button variant="outline" size="sm" onClick={() => handleEdit(hospital.id)} className="gap-2">
                          <Edit2 className="w-4 h-4" /> Edit Capacity
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4">
                    {editingId === hospital.id && editValues ? (
                      <div className="space-y-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Inputs omitted for brevity, keeping your exact input logic from earlier */}
                           <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">General Beds</label>
                            <Input type="number" min="0" max={hospital.totalBeds.general} value={editValues.general} onChange={(e) => handleInputChange('general', parseInt(e.target.value))} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">ICU Beds</label>
                            <Input type="number" min="0" max={hospital.totalBeds.icu} value={editValues.icu} onChange={(e) => handleInputChange('icu', parseInt(e.target.value))} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Ventilators</label>
                            <Input type="number" min="0" max={hospital.totalBeds.ventilator} value={editValues.ventilator} onChange={(e) => handleInputChange('ventilator', parseInt(e.target.value))} />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button onClick={() => handleSave(hospital.id)} size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            <Save className="w-4 h-4" /> Save & Reset Timer
                          </Button>
                          <Button variant="outline" onClick={handleCancel} size="sm" className="gap-2">
                            <X className="w-4 h-4" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <BedStatus type="General Beds" available={hospital.availableBeds.general} total={hospital.totalBeds.general} />
                        <BedStatus type="ICU Beds" available={hospital.availableBeds.icu} total={hospital.totalBeds.icu} />
                        <BedStatus type="Ventilator Support" available={hospital.availableBeds.ventilator} total={hospital.totalBeds.ventilator} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-900">Live Sync Active</p>
              <p className="text-sm text-amber-800 mt-1">
                Updates here are saved to LocalStorage. Open the Main Dashboard in another tab, update a hospital here, and watch it instantly jump to #1 on the leaderboard due to 0m data age.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}