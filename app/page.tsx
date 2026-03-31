"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ambulance, Stethoscope, Clock, MapPin, IndianRupee, Navigation, BedSingle, Activity, Calculator, ShieldCheck, Wind, ListOrdered } from "lucide-react"
import { mockHospitals, mockDoctors } from "@/lib/mock-data"

// --- FIXED SCORING WEIGHTS ---
const DISTANCE_WEIGHT = 1.0;
const STALENESS_WEIGHT = 0.2;

export default function Home() {
  // --- STATE ---
  const [docSpecialty, setDocSpecialty] = useState("All")
  const [hoveredHospitalId, setHoveredHospitalId] = useState<string | null>(null)
  const [sortPreset, setSortPreset] = useState("optimal")

  // --- LIVE SCORING ENGINE ---
  const scoredHospitals = useMemo(() => {
    const scored = [...mockHospitals].map(h => {
      const dPen = h.distance * DISTANCE_WEIGHT;
      const sPen = h.lastUpdatedMinutes * STALENESS_WEIGHT;
      return {
        ...h,
        distancePenalty: dPen,
        stalenessPenalty: sPen,
        totalScore: dPen + sPen
      }
    });

    // Default sorting for the Directory View
    return scored.sort((a, b) => {
      if (sortPreset === "distance") return a.distance - b.distance;
      if (sortPreset === "freshness") return a.lastUpdatedMinutes - b.lastUpdatedMinutes;
      return a.totalScore - b.totalScore; 
    });
  }, [sortPreset])

  // Always identify the absolute best hospital mathematically for highlighting
  const topOptimalHospital = [...scoredHospitals].sort((a, b) => a.totalScore - b.totalScore)[0];
  
  // Find the absolute highest score to scale our native HTML bars correctly
  const maxPenaltyScore = Math.max(...scoredHospitals.map(h => h.totalScore));

  // --- DOCTOR FILTERING ---
  const filteredDoctors = useMemo(() => {
    return mockDoctors.filter(d => docSpecialty === "All" ? true : d.specialty === docSpecialty)
  }, [docSpecialty])
  const specialties = ["All", ...Array.from(new Set(mockDoctors.map(d => d.specialty)))]

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 px-4 mb-10 shadow-sm">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-blue-100 text-blue-800 mb-4 px-3 py-1 uppercase tracking-wider text-xs font-bold">
            Real-Time Routing Engine
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
            Find the care you need, <span className="text-blue-600">instantly.</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stop guessing in emergencies. We process live hospital capacity, real-time traffic distance, and dynamic data staleness to route you to safety.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        
        {/* ========================================= */}
        {/* --- MAIN DIRECTORY (ALL HOSPITALS) --- */}
        {/* ========================================= */}
        <Tabs defaultValue="emergency" className="w-full mb-16">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14 mb-8 bg-gray-200/60 p-1 rounded-xl">
            <TabsTrigger value="emergency" className="text-base rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all shadow-sm">
              <Ambulance className="w-5 h-5 mr-2" /> Live Routing
            </TabsTrigger>
            <TabsTrigger value="doctor" className="text-base rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all shadow-sm">
              <Stethoscope className="w-5 h-5 mr-2" /> Specialists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emergency" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
              <div>
                <h2 className="font-bold text-xl text-slate-800">City-Wide Directory</h2>
                <p className="text-sm text-gray-500">Showing all {scoredHospitals.length} active facilities.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Prioritize by:</span>
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
            
            {/* HORIZONTAL CARD LIST */}
            <div className="space-y-4">
              {scoredHospitals.map((hospital) => {
                const isWinner = hospital.id === topOptimalHospital.id && sortPreset === "optimal";
                
                return (
                  <Card 
                    key={hospital.id} 
                    id={`hospital-${hospital.id}`}
                    className={`bg-white transition-all duration-200 overflow-hidden border border-gray-200 shadow-sm hover:border-gray-300 ${
                      isWinner ? 'ring-2 ring-yellow-400 shadow-md' : ''
                    }`}
                  >
                    <div className="flex flex-col md:flex-row w-full">
                      
                      {/* Section 1: Info (Left) */}
                      <div className="p-5 md:w-2/5 flex flex-col justify-center relative">
                        {isWinner && <Badge className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 border-none">#1 Recommendation</Badge>}
                        <h3 className={`font-bold text-xl mb-2 ${isWinner ? 'text-slate-900' : 'text-slate-800 pr-24'}`}>
                          {hospital.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400"/> {hospital.distance} km</span>
                          <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400"/> {hospital.lastUpdatedMinutes}m ago</span>
                        </div>
                      </div>

                      {/* Section 2: Beds (Middle) */}
                      <div className="p-5 md:w-2/5 border-t md:border-t-0 md:border-l border-gray-100 flex items-center justify-around bg-gray-50/30">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><BedSingle className="w-3 h-3"/> Gen</p>
                          <p className={`font-mono text-2xl ${hospital.availableBeds.general > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{hospital.availableBeds.general}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><Activity className="w-3 h-3"/> ICU</p>
                          <p className={`font-mono text-2xl ${hospital.availableBeds.icu > 0 ? 'text-blue-600' : 'text-red-500'}`}>{hospital.availableBeds.icu}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><Wind className="w-3 h-3"/> Vent</p>
                          <p className={`font-mono text-2xl ${hospital.availableBeds.ventilator > 0 ? 'text-purple-600' : 'text-red-500'}`}>{hospital.availableBeds.ventilator}</p>
                        </div>
                      </div>

                      {/* Section 3: Action (Right) */}
                      <div className="p-5 md:w-1/5 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col items-center justify-center bg-gray-50/80">
                        <Link href={`/hospital/${hospital.id}`} className="w-full">
                          <button className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                            isWinner ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-sm' : 
                            'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                          }`}>
                            <Navigation className="w-4 h-4 mr-2" /> Route Now
                          </button>
                        </Link>
                        <p className="text-xs text-gray-400 mt-3 text-center">Score: {hospital.totalScore.toFixed(1)}</p>
                      </div>

                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* DOCTORS TAB */}
          <TabsContent value="doctor" className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
              <div><h2 className="font-bold text-xl text-slate-800">Specialist Directory</h2></div>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <Select value={docSpecialty} onValueChange={setDocSpecialty}>
                  <SelectTrigger className="w-[200px] bg-gray-50 border-gray-200"><SelectValue placeholder="All Specialties" /></SelectTrigger>
                  <SelectContent>
                    {specialties.map(spec => <SelectItem key={spec} value={spec}>{spec}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredDoctors.map(doc => (
                 <Card key={doc.id} className="bg-white border border-gray-200 shadow-sm hover:border-gray-300 transition-all">
                  <div className="flex flex-col md:flex-row w-full">
                    <div className="p-5 md:w-1/2">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl text-slate-900">{doc.name}</h3>
                        {doc.availableToday ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Available Today</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 border-gray-300">Not Available</Badge>
                        )}
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

        {/* ========================================= */}
        {/* --- THE ALGORITHM EXPLANATION SECTION --- */}
        {/* ========================================= */}
        <div className="mt-24 pt-16 border-t border-gray-200">
          
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="bg-purple-100 text-purple-800 mb-4 px-3 py-1 uppercase tracking-wider text-xs font-bold flex items-center justify-center w-max mx-auto">
              <Calculator className="w-4 h-4 mr-2" /> The Mathematics of Saving Time
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">How the Penalty Score Works</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              In an emergency, going to the closest hospital is a fatal mistake if their ICU is completely full. 
              To prevent this, our engine assigns a <strong>Penalty Score</strong> to every facility. <span className="font-semibold text-blue-600">The lower the score, the safer the choice.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            
            {/* Distance Logic */}
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
              <h3 className="font-bold text-slate-900 flex items-center text-xl mb-4">
                <MapPin className="w-6 h-6 mr-3 text-blue-500" /> 1. Distance Penalty
              </h3>
              <p className="text-gray-600 mb-4">
                We apply a direct 1-to-1 penalty for physical distance. If a hospital is 5 kilometers away, it receives a base penalty of 5.0.
              </p>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-900 font-mono">
                Distance Penalty = Distance in km × 1.0
              </div>
            </div>

            {/* Staleness Logic */}
            <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
              <h3 className="font-bold text-slate-900 flex items-center text-xl mb-4">
                <Clock className="w-6 h-6 mr-3 text-orange-500" /> 2. Staleness Penalty
              </h3>
              <p className="text-gray-600 mb-4">
                If a hospital says they have beds, but they haven't updated their data in hours, that data is dangerous to rely on. We apply a severe penalty for data staleness.
              </p>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-sm text-orange-900 font-mono">
                Staleness Penalty = Minutes Old × 0.2
              </div>
            </div>

            {/* Why 0.2? The "Aha!" Moment */}
            <div className="md:col-span-2 bg-slate-900 text-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-800">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h3 className="font-black text-2xl mb-4 text-emerald-400 flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8" /> Why multiply by 0.2?
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-lg mb-4">
                    Multiplying by 0.2 mathematically equates <strong>5 minutes of outdated data to 1 kilometer of travel time.</strong>
                  </p>
                  <p className="text-slate-400">
                    If Hospital A is 2km away but hasn't updated its system in 60 minutes, its penalty score skyrockets by +12.0. The algorithm now treats it as if it were 14 kilometers away. This elegantly forces the system to route you to Hospital B, which might be 5km away, but updated its confirmed ICU beds just 1 minute ago.
                  </p>
                </div>
                <div className="bg-black/50 p-6 rounded-2xl border border-slate-700 min-w-[280px]">
                  <p className="text-slate-500 text-sm mb-2 font-bold uppercase tracking-wider text-center">Final Formula</p>
                  <div className="text-center font-mono text-xl space-y-2">
                    <div className="text-blue-400">Dist × 1.0</div>
                    <div className="text-slate-500">+</div>
                    <div className="text-orange-400">Mins × 0.2</div>
                    <div className="text-slate-500 border-t border-slate-700 pt-2 mt-2">=</div>
                    <div className="text-white font-bold text-2xl">Total Penalty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================= */}
          {/* --- NATIVE HTML LEADERBOARD --- */}
          {/* ========================================= */}
          
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm mb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <ListOrdered className="w-6 h-6 text-slate-600" /> Algorithm Leaderboard
                </h3>
                <p className="text-sm text-gray-500 max-w-2xl">
                  Visualizing the total Penalty Score for all 25 hospitals. <strong>Shorter bars represent safer, faster, more reliable routing.</strong>
                </p>
              </div>
              <div className="flex gap-4 text-sm font-medium">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Distance Penalty</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Staleness Penalty</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Ensure we map over a mathematically sorted array (Best to Worst, so index 0 is lowest score) */}
              {[...scoredHospitals].sort((a, b) => a.totalScore - b.totalScore).map((hospital, index) => {
                const isWinner = index === 0;
                
                // Calculate widths based on the max score so they scale correctly within the container
                const distWidth = (hospital.distancePenalty / maxPenaltyScore) * 100;
                const staleWidth = (hospital.stalenessPenalty / maxPenaltyScore) * 100;

                return (
                  <div 
                    key={hospital.id} 
                    className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-6 p-4 rounded-xl border transition-colors ${
                      isWinner ? 'bg-yellow-50/50 border-yellow-200' : 
                      (hoveredHospitalId === hospital.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50')
                    }`}
                    onMouseEnter={() => setHoveredHospitalId(hospital.id)}
                    onMouseLeave={() => setHoveredHospitalId(null)}
                  >
                    
                    {/* Rank & Name */}
                    <div className="flex items-center gap-3 md:w-1/4 min-w-[200px]">
                      <span className={`font-bold w-6 text-center ${isWinner ? 'text-yellow-600' : 'text-gray-400'}`}>
                        {isWinner ? '★' : `#${index + 1}`}
                      </span>
                      <span className={`font-semibold truncate ${isWinner ? 'text-slate-900' : 'text-slate-700'}`}>
                        {hospital.name}
                      </span>
                    </div>

                    {/* The Visual Native Bar */}
                    <div className="flex-1 h-6 bg-gray-200/50 rounded-full overflow-hidden flex relative group">
                      {/* Distance Segment */}
                      <div 
                        style={{ width: `${distWidth}%` }} 
                        className="bg-blue-500 h-full transition-all duration-500 ease-out border-r border-white/20"
                      />
                      {/* Staleness Segment */}
                      <div 
                        style={{ width: `${staleWidth}%` }} 
                        className="bg-orange-500 h-full transition-all duration-500 ease-out"
                      />
                      
                      {/* Tooltip on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-slate-900/90 text-white text-xs flex items-center justify-center transition-opacity rounded-full backdrop-blur-sm font-medium tracking-wide">
                        Dist: {hospital.distancePenalty.toFixed(1)} + Stale: {hospital.stalenessPenalty.toFixed(1)}
                      </div>
                    </div>

                    {/* Total Score Readout */}
                    <div className="md:w-24 text-right flex items-center justify-end">
                      <Badge variant="outline" className={`font-mono text-sm px-2 py-1 ${isWinner ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-white text-slate-700 border-gray-200'}`}>
                        {hospital.totalScore.toFixed(1)}
                      </Badge>
                    </div>

                  </div>
                )
              })}
            </div>

          </div>

        </div>
      </div>
    </main>
  )
}