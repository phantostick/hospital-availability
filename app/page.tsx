"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ambulance, Stethoscope, Clock, MapPin, IndianRupee, Info, Calculator } from "lucide-react"
import { HospitalCard } from "@/components/hospital-card"
import { mockHospitals, mockDoctors } from "@/lib/mock-data"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Cell
} from "recharts"

// --- SCORING ALGORITHM ---
const calculatePenaltyScore = (distance: number, staleness: number) => {
  const distanceWeight = 1.0;
  const stalenessWeight = 0.2;
  return {
    distancePenalty: distance * distanceWeight,
    stalenessPenalty: staleness * stalenessWeight,
    total: (distance * distanceWeight) + (staleness * stalenessWeight)
  };
}

// --- CUSTOM TOOLTIP FOR BAR CHART ---
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl min-w-[220px]">
        <p className="text-white font-bold text-lg mb-2 border-b border-slate-700 pb-2">{data.fullName}</p>
        <div className="space-y-1.5">
          <p className="text-blue-400 text-sm flex justify-between gap-4">
            <span>Distance Penalty:</span> <strong>{data.distancePenalty.toFixed(1)}</strong>
          </p>
          <p className="text-orange-400 text-sm flex justify-between gap-4">
            <span>Staleness Penalty:</span> <strong>{data.stalenessPenalty.toFixed(1)}</strong>
          </p>
          <div className="pt-2 mt-2 border-t border-slate-700/50">
            <p className="text-purple-400 text-sm flex justify-between gap-4 font-mono bg-purple-400/10 p-1.5 rounded">
              <span>Total Score:</span> <strong>{data.totalScore.toFixed(1)}</strong>
            </p>
          </div>
        </div>
        {data.isWinner && (
          <div className="mt-3 pt-2 border-t border-slate-700">
            <p className="text-yellow-400 text-sm font-bold flex items-center gap-1">
              ⭐ Top Recommendation
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function Home() {
  const [hospitalSort, setHospitalSort] = useState("optimal")
  const [docSpecialty, setDocSpecialty] = useState("All")

  // --- HOSPITAL SORTING LOGIC ---
  const sortedHospitals = [...mockHospitals].sort((a, b) => {
    if (hospitalSort === "distance") return a.distance - b.distance
    if (hospitalSort === "freshness") return a.lastUpdatedMinutes - b.lastUpdatedMinutes
    
    // Optimal Sort
    const scoreA = calculatePenaltyScore(a.distance, a.lastUpdatedMinutes).total
    const scoreB = calculatePenaltyScore(b.distance, b.lastUpdatedMinutes).total
    return scoreA - scoreB
  })

  // --- DOCTOR FILTERING LOGIC ---
  const specialties = ["All", ...Array.from(new Set(mockDoctors.map(d => d.specialty)))]
  const filteredDoctors = mockDoctors.filter(d => 
    docSpecialty === "All" ? true : d.specialty === docSpecialty
  )

  // --- RECHARTS DATA PREP (STACKED BAR) ---
  // We only take the top 8 to avoid clutter, and reverse them so #1 is at the top of the chart
  const topHospitals = sortedHospitals.slice(0, 8);
  const chartData = [...topHospitals].reverse().map(h => {
    const scores = calculatePenaltyScore(h.distance, h.lastUpdatedMinutes);
    return {
      name: h.name.length > 18 ? h.name.substring(0, 18) + '...' : h.name, // Truncate for clean Y-axis
      fullName: h.name,
      distancePenalty: scores.distancePenalty,
      stalenessPenalty: scores.stalenessPenalty,
      totalScore: scores.total,
      isWinner: h.id === sortedHospitals[0].id 
    }
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-12 font-sans text-gray-900">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 px-4 mb-8">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-4 px-3 py-1">
            Real-Time Information System
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Find the care you need, <span className="text-blue-600">before you leave.</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stop guessing in emergencies. Get live visibility into hospital beds, ICU availability, and specialist doctors near you instantly.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <Tabs defaultValue="emergency" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 mb-8 bg-gray-200/50 p-1 rounded-xl">
            <TabsTrigger value="emergency" className="text-base rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all">
              <Ambulance className="w-5 h-5 mr-2" />
              Emergency & Beds
            </TabsTrigger>
            <TabsTrigger value="doctor" className="text-base rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
              <Stethoscope className="w-5 h-5 mr-2" />
              Find a Doctor
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: EMERGENCY */}
          <TabsContent value="emergency" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border shadow-sm gap-4">
              <div>
                <h2 className="font-semibold text-xl">Hospital Routing</h2>
                <p className="text-sm text-gray-500">Live capacity across your city</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Prioritize by:</span>
                <Select value={hospitalSort} onValueChange={setHospitalSort}>
                  <SelectTrigger className="w-[200px] bg-gray-50">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="optimal">⭐ Optimal Match</SelectItem>
                    <SelectItem value="distance">📍 Closest Distance</SelectItem>
                    <SelectItem value="freshness">⏱️ Most Recently Updated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {sortedHospitals.map((hospital, index) => (
                <HospitalCard 
                  key={hospital.id} 
                  hospital={hospital} 
                  isOptimal={hospitalSort === "optimal" && index === 0} 
                />
              ))}
            </div>
          </TabsContent>

          {/* TAB 2: DOCTORS */}
          <TabsContent value="doctor" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border shadow-sm gap-4">
              <div>
                <h2 className="font-semibold text-xl">Specialist Directory</h2>
                <p className="text-sm text-gray-500">View schedules and availability</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Specialty:</span>
                <Select value={docSpecialty} onValueChange={setDocSpecialty}>
                  <SelectTrigger className="w-[180px] bg-gray-50">
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {filteredDoctors.map(doc => (
                <Card key={doc.id} className="border-2 border-transparent hover:border-blue-100 transition-all">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{doc.name}</h3>
                        <p className="text-blue-600 text-sm font-medium">{doc.specialty}</p>
                      </div>
                      {doc.availableToday ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available Today</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">Not Available</Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 mt-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {doc.hospitalName}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        {doc.timings} <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded">Next: {doc.nextAvailable}</span>
                      </div>
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 mr-2 text-gray-400" />
                        Consultation: ₹{doc.fees}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* --- ALGORITHM EXPLANATION & VISUALIZATION SECTION --- */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Info className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold">Why "Optimal" Routing Saves Lives</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6 text-slate-300">
                <p>
                  In a medical emergency, routing a patient to the <em>absolute closest</em> hospital can be a fatal flaw if that hospital's data is stale and their ICU is actually full. Conversely, routing them to a hospital with perfectly fresh data that is 30km away wastes precious "Golden Hour" time.
                </p>
                
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                  <Calculator className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-slate-700 opacity-20" />
                  <h3 className="text-lg font-semibold text-white mb-3">The Penalty Scoring Formula</h3>
                  <p className="text-sm mb-4 text-slate-400">
                    Our algorithm assigns a "penalty score" to each facility. <strong className="text-white">The lower the score, the higher the recommendation.</strong>
                  </p>
                  <code className="block bg-black p-4 rounded text-blue-300 font-mono text-sm overflow-x-auto mb-4 border border-blue-900/50">
                    Score = (Distance × 1.0) + (Staleness × 0.2)
                  </code>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li><strong className="text-white">Distance:</strong> Kilometers away.</li>
                    <li><strong className="text-white">Staleness:</strong> Minutes since the hospital last updated their bed count.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Visualizing the Trade-off</h3>
                  <p className="text-sm text-slate-400">
                    The chart clearly breaks down the penalty scores for the top 8 recommended hospitals. You can instantly see if a hospital was heavily penalized due to distance (blue bar) or due to stale, unreliable data (orange bar). The shortest total bar wins.
                  </p>
                </div>
              </div>

              {/* Stacked Bar Chart Visualization */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-2">Top 8 Leaderboard Breakdown</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Shorter bars are better. The <span className="text-yellow-400 font-bold">yellow text</span> indicates the #1 choice based on your current sorting criteria.
                </p>
                
                <div className="flex-grow w-full min-h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={chartData}
                      margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} domain={[0, 'dataMax + 5']} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="#94a3b8" 
                        width={140}
                        tick={(props) => {
                          const { x, y, payload } = props;
                          const isWinner = chartData.find(d => d.name === payload.value)?.isWinner;
                          return (
                            <text x={x} y={y} dy={4} textAnchor="end" fill={isWinner ? "#facc15" : "#94a3b8"} fontSize={12} fontWeight={isWinner ? "bold" : "normal"}>
                              {payload.value}
                            </text>
                          );
                        }}
                      />
                      <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="distancePenalty" name="Distance Penalty" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="stalenessPenalty" name="Staleness Penalty" stackId="a" fill="#f97316" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}