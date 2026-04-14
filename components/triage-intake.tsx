'use client';

import { useState } from 'react';
import { Heart, Brain, Bone, Thermometer, ChevronRight, ChevronLeft, AlertTriangle, Phone } from 'lucide-react';

export type TriageData = {
  symptoms: string[];
  categories: string[];
  severity: 'mild' | 'moderate' | 'critical';
  requiredBedType: 'general' | 'icu' | 'icu_vent';
};

interface Props {
  onComplete: (data: TriageData) => void;
}

const SYMPTOM_GROUPS = [
  {
    label: 'Cardiac & respiratory',
    cat: 'cardiac',
    color: 'red',
    symptoms: ['Chest pain', 'Difficulty breathing', 'Heart palpitations', 'Irregular heartbeat']
  },
  {
    label: 'Neurological',
    cat: 'neuro',
    color: 'purple',
    symptoms: ['Stroke symptoms (FAST)', 'Severe headache', 'Seizure', 'Loss of consciousness', 'Vision problems']
  },
  {
    label: 'Trauma & injury',
    cat: 'trauma',
    color: 'amber',
    symptoms: ['Fracture / fall', 'Heavy bleeding', 'Road accident', 'Burns', 'Spinal injury']
  },
  {
    label: 'General / other',
    cat: 'general',
    color: 'blue',
    symptoms: ['High fever', 'Severe vomiting / poisoning', 'Pregnancy emergency', 'Eye / ear emergency', 'Drug overdose', 'Severe allergic reaction']
  }
];

const colorMap: Record<string, { bg: string; border: string; text: string; chipSel: string }> = {
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    chipSel: 'bg-red-100 border-red-400 text-red-800' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', chipSel: 'bg-purple-100 border-purple-400 text-purple-800' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  chipSel: 'bg-amber-100 border-amber-400 text-amber-800' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   chipSel: 'bg-blue-100 border-blue-400 text-blue-800' }
};

function deriveRequired(cats: string[], sev: 'mild' | 'moderate' | 'critical'): 'general' | 'icu' | 'icu_vent' {
  if (sev === 'critical' || cats.includes('cardiac') || cats.includes('neuro')) return 'icu_vent';
  if (cats.includes('trauma') || sev === 'moderate') return 'icu';
  return 'general';
}

export default function TriageIntake({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'critical' | null>(null);

  const toggleSymptom = (sym: string, cat: string) => {
    setSelectedSymptoms(prev => {
      const next = new Set(prev);
      if (next.has(sym)) { next.delete(sym); } else { next.add(sym); }
      return next;
    });
    setSelectedCats(prev => {
      const next = new Set(prev);
      const groupSyms = SYMPTOM_GROUPS.find(g => g.cat === cat)?.symptoms ?? [];
      const stillHas = groupSyms.some(s => s !== sym && selectedSymptoms.has(s));
      if (!selectedSymptoms.has(sym)) {
        next.add(cat);
      } else if (!stillHas) {
        next.delete(cat);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    if (!severity) return;
    const cats = Array.from(selectedCats);
    onComplete({
      symptoms: Array.from(selectedSymptoms),
      categories: cats,
      severity,
      requiredBedType: deriveRequired(cats, severity)
    });
  };

  const isCritical = severity === 'critical';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
            <AlertTriangle className="w-3.5 h-3.5" /> Emergency Triage
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">What's your emergency?</h1>
          <p className="text-slate-500">Tell us your symptoms and we'll find the nearest suitable hospital in Visakhapatnam</p>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(n => (
            <div key={n} className={`w-2 h-2 rounded-full transition-all ${n <= step ? 'bg-slate-800 w-6' : 'bg-slate-300'}`} />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* STEP 1: Symptoms */}
          {step === 1 && (
            <div className="p-6">
              <p className="text-lg font-semibold text-slate-800 mb-1">Select your symptoms</p>
              <p className="text-sm text-slate-500 mb-6">Select all that apply. This helps us route you to the right ward.</p>

              <div className="space-y-5">
                {SYMPTOM_GROUPS.map(group => {
                  const c = colorMap[group.color];
                  return (
                    <div key={group.cat} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                      <p className={`text-xs font-bold uppercase tracking-wider ${c.text} mb-3`}>{group.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.symptoms.map(sym => {
                          const sel = selectedSymptoms.has(sym);
                          return (
                            <button
                              key={sym}
                              onClick={() => toggleSymptom(sym, group.cat)}
                              className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${sel ? c.chipSel + ' border-2' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'}`}
                            >
                              {sym}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <span className="text-sm text-slate-500">
                  {selectedSymptoms.size === 0 ? 'Select at least one symptom' : `${selectedSymptoms.size} symptom${selectedSymptoms.size > 1 ? 's' : ''} selected`}
                </span>
                <button
                  disabled={selectedSymptoms.size === 0}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Severity */}
          {step === 2 && (
            <div className="p-6">
              <p className="text-lg font-semibold text-slate-800 mb-1">How severe is it?</p>
              <p className="text-sm text-slate-500 mb-6">This determines which ward and bed type we prioritise</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { key: 'mild', icon: '🟢', label: 'Mild', desc: 'Stable, can wait', border: 'border-emerald-400 bg-emerald-50', text: 'text-emerald-800' },
                  { key: 'moderate', icon: '🟡', label: 'Moderate', desc: 'Worsening, needs care soon', border: 'border-amber-400 bg-amber-50', text: 'text-amber-800' },
                  { key: 'critical', icon: '🔴', label: 'Critical', desc: 'Life-threatening', border: 'border-red-400 bg-red-50', text: 'text-red-800' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setSeverity(opt.key as any)}
                    className={`rounded-xl border-2 p-4 text-center transition-all hover:shadow-sm ${severity === opt.key ? opt.border : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className="text-2xl mb-2">{opt.icon}</div>
                    <div className={`font-semibold text-sm ${severity === opt.key ? opt.text : 'text-slate-800'}`}>{opt.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  disabled={!severity}
                  onClick={() => setStep(3)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                >
                  Review <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && severity && (
            <div className="p-6">
              <p className="text-lg font-semibold text-slate-800 mb-1">Confirm & find hospitals</p>
              <p className="text-sm text-slate-500 mb-5">We'll show only hospitals that can handle your case</p>

              {isCritical && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800">Critical emergency detected</p>
                    <p className="text-xs text-red-600">Consider calling 108 (Ambulance) immediately</p>
                  </div>
                  <a href="tel:108" className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    <Phone className="w-3.5 h-3.5" /> 108
                  </a>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200 mb-6">
                <div className="flex justify-between items-start p-4">
                  <span className="text-sm text-slate-500">Symptoms</span>
                  <div className="text-sm text-slate-800 text-right max-w-xs">
                    {Array.from(selectedSymptoms).join(', ')}
                  </div>
                </div>
                <div className="flex justify-between items-center p-4">
                  <span className="text-sm text-slate-500">Severity</span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    severity === 'mild' ? 'bg-emerald-100 text-emerald-800' :
                    severity === 'moderate' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4">
                  <span className="text-sm text-slate-500">Bed priority</span>
                  <span className="text-sm font-medium text-slate-800">
                    {deriveRequired(Array.from(selectedCats), severity) === 'icu_vent' ? 'ICU + Ventilator' :
                     deriveRequired(Array.from(selectedCats), severity) === 'icu' ? 'ICU bed' : 'General ward'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                >
                  Find nearest hospital →
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">For life-threatening emergencies, always call 108 first</p>
      </div>
    </div>
  );
}