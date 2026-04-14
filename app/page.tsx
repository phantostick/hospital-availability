"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Ambulance, Stethoscope, Clock, MapPin, IndianRupee, Navigation,
  BedSingle, Activity, Calculator, ShieldCheck, Wind, ListOrdered,
  Lock, LocateFixed, AlertTriangle, RefreshCw, CheckCircle2, Phone
} from "lucide-react"
import { mockHospitals, mockDoctors, Hospital } from "@/lib/mock-data"
import TriageIntake, { TriageData } from "@/components/triage-intake"

const DISTANCE_WEIGHT = 1.0;
const STALENESS_WEIGHT = 0.2;

// Haversine formula for real distance in km
function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Visakhapatnam city centre as fallback
const VSP_LAT = 17.6868;
const VSP_LNG = 83.2185;

type GeoState = 'idle' | 'loading' | 'granted' | 'denied' | 'unavailable';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [triageData, setTriageData] = useState<TriageData | null>(null);
  const [showTriage, setShowTriage] = useState(true);

  const [userLat, setUserLat] = useState<number>(VSP_LAT);
  const [userLng, setUserLng] = useState<number>(VSP_LNG);
  const [geoState, setGeoState] = useState<GeoState>('idle');

  const [docSpecialty, setDocSpecialty] = useState("All");
  const [hoveredHospitalId, setHoveredHospitalId] = useState<string | null>(null);
  const [sortPreset, setSortPreset] = useState("optimal");
  const [liveHospitals, setLiveHospitals] = useState<Hospital[]>([]);
  const [now, setNow] = useState(Date.now());

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoState('unavailable');
      return;
    }
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setGeoState('granted');
      },
      () => {
        setGeoState('denied');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem('liveHospitals_vzg');
    if (stored) {
      setLiveHospitals(JSON.parse(stored));
    } else {
      const initialData = mockHospitals.map(h => ({
        ...h,
        lastUpdatedAt: Date.now() - (h.lastUpdatedMinutes * 60000)
      }));
      setLiveHospitals(initialData);
      localStorage.setItem('liveHospitals_vzg', JSON.stringify(initialData));
    }

    const timer = setInterval(() => {
      setNow(Date.now());
      const s = localStorage.getItem('liveHospitals_vzg');
      if (s) setLiveHospitals(JSON.parse(s));
    }, 60000);

    const handleFocus = () => {
      const s = localStorage.getItem('liveHospitals_vzg');
      if (s) setLiveHospitals(JSON.parse(s));
      setNow(Date.now());
    };
    window.addEventListener('focus', handleFocus);

    // Auto-request location
    requestLocation();

    return () => { clearInterval(timer); window.removeEventListener('focus', handleFocus); };
  }, [requestLocation]);

  // Compute hospitals with live distances + scoring + triage filter
  const scoredHospitals = useMemo(() => {
    if (!liveHospitals.length) return [];

    const scored = liveHospitals.map(h => {
      const dist = parseFloat(calcDistance(userLat, userLng, h.lat, h.lng).toFixed(1));
      const actualMins = h.lastUpdatedAt ? Math.floor((now - h.lastUpdatedAt) / 60000) : h.lastUpdatedMinutes;
      const safeMins = Math.max(0, actualMins);
      const dPen = dist * DISTANCE_WEIGHT;
      const sPen = safeMins * STALENESS_WEIGHT;
      return { ...h, distance: dist, lastUpdatedMinutes: safeMins, distancePenalty: dPen, stalenessPenalty: sPen, totalScore: dPen + sPen };
    });

    // Apply triage filter if we have triage data
    let filtered = scored;
    if (triageData) {
      filtered = scored.filter(h => {
        // Filter by specialty match
        const catMatch = triageData.categories.length === 0 ||
          triageData.categories.some(cat => h.specialties.includes(cat));

        // Filter by bed availability
        const bedType = triageData.requiredBedType;
        if (bedType === 'icu_vent') return catMatch && h.availableBeds.icu > 0 && h.availableBeds.ventilator > 0;
        if (bedType === 'icu') return catMatch && h.availableBeds.icu > 0;
        return catMatch && h.availableBeds.general > 0;
      });
    }

    return filtered.sort((a, b) => {
      if (sortPreset === "distance") return a.distance - b.distance;
      if (sortPreset === "freshness") return a.lastUpdatedMinutes - b.lastUpdatedMinutes;
      return a.totalScore - b.totalScore;
    });
  }, [liveHospitals, sortPreset, now, userLat, userLng, triageData]);

  const filteredDoctors = useMemo(() =>
    mockDoctors.filter(d => docSpecialty === "All" ? true : d.specialty === docSpecialty),
    [docSpecialty]
  );
  const specialties = ["All", ...Array.from(new Set(mockDoctors.map(d => d.specialty)))];

  const handleTriageComplete = (data: TriageData) => {
    setTriageData(data);
    setShowTriage(false);
  };

  if (!mounted) return null;

  // Show triage intake first
  if (showTriage) {
    return <TriageIntake onComplete={handleTriageComplete} />;
  }

  const topOptimalHospital = scoredHospitals[0];
  const maxPenaltyScore = Math.max(...scoredHospitals.map(h => h.totalScore), 1);

  const bedLabel = triageData?.requiredBedType === 'icu_vent' ? 'ICU + Ventilator' :
                   triageData?.requiredBedType === 'icu' ? 'ICU' : 'General';

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24 relative">

      {/* Admin link */}
      <div className="absolute top-4 right-4 md:top-6 md:right-8 z-10">
        <Link href="/admin/login">
          <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-blue-700 transition-colors shadow-sm">
            <Lock className="w-4 h-4 mr-2" />Hospital Portal
          </Button>
        </Link>
      </div>

      {/* Hero */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-10 px-4 mb-8 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <Badge className="bg-blue-100 text-blue-800 mb-3 px-3 py-1 uppercase tracking-wider text-xs font-bold">
                Visakhapatnam · Real-Time Routing
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 text-slate-900">
                Nearest hospitals for <span className="text-blue-600">your emergency</span>
              </h1>
              {triageData && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    triageData.severity === 'mild' ? 'bg-emerald-100 text-emerald-800' :
                    triageData.severity === 'moderate' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {triageData.severity.toUpperCase()}
                  </span>
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-100 text-blue-800">
                    {bedLabel} beds needed
                  </span>
                  {triageData.symptoms.slice(0, 3).map(s => (
                    <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">{s}</span>
                  ))}
                  <button
                    onClick={() => setShowTriage(true)}
                    className="text-xs px-3 py-1.5 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
                  >
                    ↺ Change
                  </button>
                </div>
              )}
            </div>

            {/* Geolocation status */}
            <div className="flex-shrink-0">
              {geoState === 'granted' ? (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-800">Location active</p>
                    <p className="text-xs text-emerald-600">Distances calculated from you</p>
                  </div>
                </div>
              ) : geoState === 'loading' ? (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                  <p className="text-xs font-medium text-blue-700">Getting location…</p>
                </div>
              ) : (
                <button
                  onClick={requestLocation}
                  className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <LocateFixed className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-700">Enable location</p>
                    <p className="text-xs text-slate-400">
                      {geoState === 'denied' ? 'Permission denied — using city centre' : 'For accurate distances'}
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>

          {triageData?.severity === 'critical' && (
            <div className="mt-4 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800 font-medium">Critical case — showing only hospitals with ICU + ventilator availability. Call 108 immediately if condition worsens.</p>
              <a href="tel:108" className="ml-auto flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex-shrink-0">
                <Phone className="w-3.5 h-3.5" /> 108
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <Tabs defaultValue="emergency" className="w-full mb-16">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14 mb-8 bg-gray-200/60 p-1 rounded-xl">
            <TabsTrigger value="emergency" className="text-base rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all shadow-sm">
              <Ambulance className="w-5 h-5 mr-2" /> Emergency
            </TabsTrigger>
            <TabsTrigger value="doctor" className="text-base rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all shadow-sm">
              <Stethoscope className="w-5 h-5 mr-2" /> Specialists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emergency" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
              <div>
                <h2 className="font-bold text-xl text-slate-800">
                  {triageData ? `${scoredHospitals.length} matching hospitals` : 'City-Wide Directory'}
                </h2>
                <p className="text-sm text-gray-500">
                  {triageData
                    ? `Filtered for ${bedLabel} beds · ${triageData.symptoms.slice(0,2).join(', ')}${triageData.symptoms.length > 2 ? '…' : ''}`
                    : `Showing all ${scoredHospitals.length} active facilities in Visakhapatnam`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Sort:</span>
                <Select value={sortPreset} onValueChange={setSortPreset}>
                  <SelectTrigger className="w-[200px] bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Sort preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="optimal">⭐ Optimal Algorithm</SelectItem>
                    <SelectItem value="distance">📍 Closest Distance</SelectItem>
                    <SelectItem value="freshness">⏱️ Most Recently Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {scoredHospitals.length === 0 ? (
              <div className="bg-white border border-amber-200 rounded-xl p-8 text-center">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="font-bold text-lg text-slate-800 mb-2">No matching hospitals found</h3>
                <p className="text-slate-500 text-sm mb-4">No hospital in Visakhapatnam currently has {bedLabel} beds available for your symptoms.</p>
                <div className="flex flex-col gap-2 items-center">
                  <a href="tel:108" className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors">
                    <Phone className="w-4 h-4" /> Call 108 — Emergency Ambulance
                  </a>
                  <button onClick={() => setShowTriage(true)} className="text-sm text-slate-500 hover:text-slate-800 underline mt-1">
                    Change triage criteria
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {scoredHospitals.map((hospital, idx) => {
                  const isWinner = idx === 0 && sortPreset === "optimal";
                  return (
                    <Card key={hospital.id} className={`bg-white transition-all duration-200 overflow-hidden border border-gray-200 shadow-sm hover:border-gray-300 ${isWinner ? 'ring-2 ring-yellow-400 shadow-md' : ''}`}>
                      <div className="flex flex-col md:flex-row w-full">
                        <div className="p-5 md:w-2/5 flex flex-col justify-center relative">
                          {isWinner && <Badge className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 border-none">#1 Nearest Match</Badge>}
                          <h3 className={`font-bold text-lg mb-1 ${isWinner ? 'text-slate-900' : 'text-slate-800 pr-24'}`}>
                            {hospital.name}
                          </h3>
                          <p className="text-xs text-slate-500 mb-2">{hospital.location}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-gray-400" /> {hospital.distance} km
                            </span>
                            <span className="flex items-center">
                              <Clock className={`w-4 h-4 mr-1 ${hospital.lastUpdatedMinutes === 0 ? 'text-emerald-500 animate-pulse' : 'text-gray-400'}`} />
                              <span className={hospital.lastUpdatedMinutes === 0 ? 'text-emerald-600 font-bold' : ''}>
                                {hospital.lastUpdatedMinutes === 0 ? 'Just now' : `${hospital.lastUpdatedMinutes}m ago`}
                              </span>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {hospital.specialties.map(s => (
                              <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${
                                triageData?.categories.includes(s) ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-500'
                              }`}>{s}</span>
                            ))}
                          </div>
                        </div>

                        <div className="p-5 md:w-2/5 border-t md:border-t-0 md:border-l border-gray-100 flex items-center justify-around bg-gray-50/30">
                          {[
                            { label: 'Gen', icon: BedSingle, val: hospital.availableBeds.general, color: 'text-emerald-600', needHighlight: triageData?.requiredBedType === 'general' },
                            { label: 'ICU', icon: Activity, val: hospital.availableBeds.icu, color: 'text-blue-600', needHighlight: triageData?.requiredBedType === 'icu' || triageData?.requiredBedType === 'icu_vent' },
                            { label: 'Vent', icon: Wind, val: hospital.availableBeds.ventilator, color: 'text-purple-600', needHighlight: triageData?.requiredBedType === 'icu_vent' }
                          ].map(({ label, icon: Icon, val, color, needHighlight }) => (
                            <div key={label} className={`text-center rounded-lg px-3 py-2 ${needHighlight ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}>
                              <p className={`text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1 ${needHighlight ? 'text-blue-600' : 'text-gray-500'}`}>
                                <Icon className="w-3 h-3" /> {label}
                              </p>
                              <p className={`font-mono text-2xl ${val > 0 ? color : 'text-red-500'}`}>{val}</p>
                            </div>
                          ))}
                        </div>

                        <div className="p-5 md:w-1/5 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col items-center justify-center gap-2 bg-gray-50/80">
                          <Link href={`/hospital/${hospital.id}`} className="w-full">
                            <button className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                              isWinner ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-sm' :
                              'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                            }`}>
                              <Navigation className="w-4 h-4 mr-2" /> Route Now
                            </button>
                          </Link>
                          <a href={`tel:${hospital.contact.replace(/\s/g,'')}`} className="w-full flex items-center justify-center gap-1.5 border border-slate-200 text-slate-600 py-2 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors">
                            <Phone className="w-3.5 h-3.5" /> {hospital.contact}
                          </a>
                          <p className="text-xs text-gray-400">Score: {hospital.totalScore.toFixed(1)}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Doctors tab */}
          <TabsContent value="doctor" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
              <div><h2 className="font-bold text-xl text-slate-800">Specialist Directory</h2></div>
              <Select value={docSpecialty} onValueChange={setDocSpecialty}>
                <SelectTrigger className="w-[200px] bg-gray-50 border-gray-200"><SelectValue placeholder="All Specialties" /></SelectTrigger>
                <SelectContent>
                  {specialties.map(spec => <SelectItem key={spec} value={spec}>{spec}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              {filteredDoctors.map(doc => (
                <Card key={doc.id} className="bg-white border border-gray-200 shadow-sm hover:border-gray-300 transition-all">
                  <div className="flex flex-col md:flex-row w-full">
                    <div className="p-5 md:w-1/2">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-slate-900">{doc.name}</h3>
                        {doc.availableToday
                          ? <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Available Today</Badge>
                          : <Badge variant="outline" className="text-gray-500 border-gray-300">Not Available</Badge>}
                      </div>
                      <p className="text-blue-600 text-sm font-bold uppercase tracking-wider">{doc.specialty}</p>
                    </div>
                    <div className="p-5 md:w-1/2 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center space-y-2 bg-gray-50/30">
                      <div className="flex items-center text-sm text-gray-600"><MapPin className="w-4 h-4 mr-3 text-gray-400" />{doc.hospitalName}</div>
                      <div className="flex items-center text-sm text-gray-600"><Clock className="w-4 h-4 mr-3 text-gray-400" />{doc.timings}</div>
                      <div className="flex items-center text-sm text-gray-600"><IndianRupee className="w-4 h-4 mr-3 text-gray-400" />₹{doc.fees} Consultation</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Algorithm section */}
        {scoredHospitals.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <Badge className="bg-purple-100 text-purple-800 mb-4 px-3 py-1 uppercase tracking-wider text-xs font-bold flex items-center justify-center w-max mx-auto">
                <Calculator className="w-4 h-4 mr-2" /> Routing Algorithm
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">How we ranked these hospitals</h2>
              <p className="text-gray-600">
                After filtering for <strong>{bedLabel} availability</strong> and matching specialties, we rank by penalty score. Lower = safer choice.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm mb-20">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ListOrdered className="w-6 h-6 text-slate-600" /> Algorithm Leaderboard
                </h3>
                <div className="flex gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Distance</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Staleness</div>
                </div>
              </div>

              <div className="space-y-3">
                {scoredHospitals.map((hospital, index) => {
                  const isWinner = index === 0;
                  const distWidth = (hospital.distancePenalty / maxPenaltyScore) * 100;
                  const staleWidth = (hospital.stalenessPenalty / maxPenaltyScore) * 100;
                  return (
                    <div
                      key={hospital.id}
                      className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-6 p-4 rounded-xl border transition-colors ${
                        isWinner ? 'bg-yellow-50/50 border-yellow-200' :
                        hoveredHospitalId === hospital.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                      }`}
                      onMouseEnter={() => setHoveredHospitalId(hospital.id)}
                      onMouseLeave={() => setHoveredHospitalId(null)}
                    >
                      <div className="flex items-center gap-3 md:w-1/3 min-w-[180px]">
                        <span className={`font-bold w-6 text-center ${isWinner ? 'text-yellow-600' : 'text-gray-400'}`}>
                          {isWinner ? '★' : `#${index + 1}`}
                        </span>
                        <div>
                          <span className={`font-semibold text-sm ${isWinner ? 'text-slate-900' : 'text-slate-700'}`}>{hospital.name}</span>
                          <p className="text-xs text-gray-400">{hospital.distance} km away</p>
                        </div>
                      </div>
                      <div className="flex-1 h-6 bg-gray-200/50 rounded-full overflow-hidden flex relative group">
                        <div style={{ width: `${distWidth}%` }} className="bg-blue-500 h-full transition-all duration-500 ease-out border-r border-white/20" />
                        <div style={{ width: `${staleWidth}%` }} className="bg-orange-500 h-full transition-all duration-500 ease-out" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-slate-900/90 text-white text-xs flex items-center justify-center transition-opacity rounded-full backdrop-blur-sm font-medium tracking-wide">
                          Dist: {hospital.distancePenalty.toFixed(1)} + Stale: {hospital.stalenessPenalty.toFixed(1)}
                        </div>
                      </div>
                      <div className="md:w-24 text-right flex items-center justify-end">
                        <Badge variant="outline" className={`font-mono text-sm px-2 py-1 ${isWinner ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-white text-slate-700 border-gray-200'}`}>
                          {hospital.totalScore.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}