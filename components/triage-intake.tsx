'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, AlertTriangle, Phone } from 'lucide-react';

export type TriageData = {
  symptoms: string[];
  categories: string[];
  severity: 'mild' | 'moderate' | 'critical';
  requiredBedType: 'general' | 'icu' | 'icu_vent';
};

interface Props {
  onComplete: (data: TriageData) => void;
}

// Each group maps to a specialty tag used in mockHospitals[].specialties
const SYMPTOM_GROUPS = [
  {
    label: 'Cardiac & respiratory',
    cat: 'cardiac',
    color: 'red',
    emoji: '❤️',
    symptoms: [
      'Chest pain or tightness',
      'Difficulty breathing',
      'Heart palpitations',
      'Irregular heartbeat',
      'Cardiac arrest / no pulse',
    ],
  },
  {
    label: 'Neurological',
    cat: 'neuro',
    color: 'purple',
    emoji: '🧠',
    symptoms: [
      'Stroke symptoms (FAST)',
      'Sudden severe headache',
      'Seizure / fits',
      'Loss of consciousness',
      'Memory loss / confusion',
    ],
  },
  {
    label: 'Trauma & injury',
    cat: 'trauma',
    color: 'amber',
    emoji: '🩹',
    symptoms: [
      'Heavy / uncontrolled bleeding',
      'Road accident injury',
      'Fall from height',
      'Spinal / neck injury',
      'Crush injury',
    ],
  },
  {
    label: 'Burns',
    cat: 'burns',
    color: 'orange',
    emoji: '🔥',
    symptoms: [
      'Burns (minor — small area)',
      'Burns (major — large area)',
      'Chemical / acid burns',
      'Electrical injury',
      'Inhalation / smoke injury',
    ],
  },
  {
    label: 'Bone & joint',
    cat: 'ortho',
    color: 'slate',
    emoji: '🦴',
    symptoms: [
      'Suspected bone fracture',
      'Joint dislocation',
      'Severe back / spine pain',
      'Sports injury',
      'Ligament / tendon tear',
    ],
  },
  {
    label: 'Eye emergency',
    cat: 'eye',
    color: 'cyan',
    emoji: '👁️',
    symptoms: [
      'Eye injury or foreign body',
      'Chemical splash in eye',
      'Sudden vision loss',
      'Severe eye pain / redness',
      'Retinal emergency (flashes / curtain)',
    ],
  },
  {
    label: 'Kidney & urinary',
    cat: 'renal',
    color: 'indigo',
    emoji: '🫘',
    symptoms: [
      'Severe flank / kidney pain',
      'Unable to pass urine',
      'Dialysis emergency',
      'Blood in urine',
      'Acute kidney failure symptoms',
    ],
  },
  {
    label: 'Cancer / oncology',
    cat: 'oncology',
    color: 'pink',
    emoji: '🩺',
    symptoms: [
      'Cancer-related severe pain',
      'Chemotherapy side effects',
      'Unexplained weight loss / lump',
      'Post-surgery cancer complication',
      'Palliative / pain management',
    ],
  },
  {
    label: 'Pregnancy & women',
    cat: 'maternity',
    color: 'rose',
    emoji: '🤰',
    symptoms: [
      'Labour / delivery emergency',
      'Severe pregnancy pain / bleeding',
      'Miscarriage symptoms',
      'Postpartum complication',
      'Pre-eclampsia / high BP in pregnancy',
    ],
  },
  {
    label: 'Child emergency',
    cat: 'pediatric',
    color: 'green',
    emoji: '👶',
    symptoms: [
      'Child high fever / convulsion',
      'Infant breathing difficulty',
      'Child poisoning / accidental ingestion',
      'Neonatal emergency',
      'Childhood fracture or injury',
    ],
  },
  {
    label: 'Mental health',
    cat: 'psychiatric',
    color: 'violet',
    emoji: '🧘',
    symptoms: [
      'Suicidal ideation / self-harm',
      'Acute psychosis / hallucinations',
      'Severe panic / anxiety attack',
      'Substance withdrawal crisis',
      'Bipolar / manic crisis',
    ],
  },
  {
    label: 'General / other',
    cat: 'general',
    color: 'blue',
    emoji: '🏥',
    symptoms: [
      'High fever (above 103°F)',
      'Severe vomiting / food poisoning',
      'Drug or alcohol overdose',
      'Severe allergic reaction (anaphylaxis)',
      'Diabetic emergency (hypo/hyperglycaemia)',
      'Ear / throat infection (severe)',
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; chipSel: string }> = {
  red:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    chipSel: 'bg-red-100 border-red-400 text-red-800 font-semibold' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', chipSel: 'bg-purple-100 border-purple-400 text-purple-800 font-semibold' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  chipSel: 'bg-amber-100 border-amber-400 text-amber-800 font-semibold' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', chipSel: 'bg-orange-100 border-orange-400 text-orange-800 font-semibold' },
  slate:  { bg: 'bg-slate-50',  border: 'border-slate-200',  text: 'text-slate-600',  chipSel: 'bg-slate-200 border-slate-400 text-slate-900 font-semibold' },
  cyan:   { bg: 'bg-cyan-50',   border: 'border-cyan-200',   text: 'text-cyan-700',   chipSel: 'bg-cyan-100 border-cyan-400 text-cyan-800 font-semibold' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', chipSel: 'bg-indigo-100 border-indigo-400 text-indigo-800 font-semibold' },
  pink:   { bg: 'bg-pink-50',   border: 'border-pink-200',   text: 'text-pink-700',   chipSel: 'bg-pink-100 border-pink-400 text-pink-800 font-semibold' },
  rose:   { bg: 'bg-rose-50',   border: 'border-rose-200',   text: 'text-rose-700',   chipSel: 'bg-rose-100 border-rose-400 text-rose-800 font-semibold' },
  green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  chipSel: 'bg-green-100 border-green-400 text-green-800 font-semibold' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', chipSel: 'bg-violet-100 border-violet-400 text-violet-800 font-semibold' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   chipSel: 'bg-blue-100 border-blue-400 text-blue-800 font-semibold' },
};

function deriveRequired(cats: string[], sev: 'mild' | 'moderate' | 'critical'): 'general' | 'icu' | 'icu_vent' {
  if (sev === 'critical' || cats.includes('cardiac') || cats.includes('neuro') || cats.includes('burns')) return 'icu_vent';
  if (cats.includes('trauma') || cats.includes('ortho') || cats.includes('pediatric') || sev === 'moderate') return 'icu';
  return 'general';
}

export default function TriageIntake({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'critical' | null>(null);

  const toggleSymptom = (sym: string, cat: string) => {
    const nextSymptoms = new Set(selectedSymptoms);
    const nextCats = new Set(selectedCats);

    if (nextSymptoms.has(sym)) {
      nextSymptoms.delete(sym);
      // remove cat only if no other symptom from same group remains
      const group = SYMPTOM_GROUPS.find(g => g.cat === cat);
      const stillHas = group?.symptoms.some(s => s !== sym && nextSymptoms.has(s));
      if (!stillHas) nextCats.delete(cat);
    } else {
      nextSymptoms.add(sym);
      nextCats.add(cat);
    }

    setSelectedSymptoms(nextSymptoms);
    setSelectedCats(nextCats);
  };

  const handleSubmit = () => {
    if (!severity) return;
    const cats = Array.from(selectedCats);
    onComplete({
      symptoms: Array.from(selectedSymptoms),
      categories: cats,
      severity,
      requiredBedType: deriveRequired(cats, severity),
    });
  };

  const isCritical = severity === 'critical';
  const bedTypeLabel = severity
    ? deriveRequired(Array.from(selectedCats), severity) === 'icu_vent' ? 'ICU + Ventilator'
      : deriveRequired(Array.from(selectedCats), severity) === 'icu' ? 'ICU bed'
      : 'General ward'
    : '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4">
            <AlertTriangle className="w-3.5 h-3.5" /> Emergency Triage · Visakhapatnam
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">What's your emergency?</h1>
          <p className="text-slate-500 text-sm">Tell us your symptoms — we'll find the nearest suitable hospital and filter out those that can't help.</p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(n => (
            <div key={n} className={`h-2 rounded-full transition-all duration-300 ${n <= step ? 'bg-slate-800 w-8' : 'bg-slate-300 w-2'}`} />
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* ── STEP 1: Symptoms ── */}
          {step === 1 && (
            <div className="p-6">
              <p className="text-lg font-semibold text-slate-800 mb-1">Select your symptoms</p>
              <p className="text-sm text-slate-500 mb-5">Choose all that apply. Multiple categories are fine.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SYMPTOM_GROUPS.map(group => {
                  const c = colorMap[group.color];
                  const groupSelected = group.symptoms.filter(s => selectedSymptoms.has(s)).length;
                  return (
                    <div key={group.cat} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                      <p className={`text-xs font-bold uppercase tracking-wider ${c.text} mb-3 flex items-center gap-1.5`}>
                        <span>{group.emoji}</span> {group.label}
                        {groupSelected > 0 && (
                          <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${c.chipSel}`}>
                            {groupSelected} selected
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.symptoms.map(sym => {
                          const sel = selectedSymptoms.has(sym);
                          return (
                            <button
                              key={sym}
                              onClick={() => toggleSymptom(sym, group.cat)}
                              className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                                sel ? c.chipSel + ' border-2 shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                              }`}
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
                  {selectedSymptoms.size === 0
                    ? 'Select at least one symptom'
                    : `${selectedSymptoms.size} symptom${selectedSymptoms.size > 1 ? 's' : ''} across ${selectedCats.size} category${selectedCats.size > 1 ? 'ies' : 'y'}`}
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

          {/* ── STEP 2: Severity ── */}
          {step === 2 && (
            <div className="p-6">
              <p className="text-lg font-semibold text-slate-800 mb-1">How severe is it?</p>
              <p className="text-sm text-slate-500 mb-6">This determines the ward and bed type we'll prioritise for you.</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { key: 'mild',     icon: '🟢', label: 'Mild',     desc: 'Stable, can wait a little', sel: 'border-emerald-400 bg-emerald-50', txt: 'text-emerald-800' },
                  { key: 'moderate', icon: '🟡', label: 'Moderate', desc: 'Worsening, needs care soon', sel: 'border-amber-400 bg-amber-50',   txt: 'text-amber-800' },
                  { key: 'critical', icon: '🔴', label: 'Critical', desc: 'Life-threatening',           sel: 'border-red-400 bg-red-50',       txt: 'text-red-800' },
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setSeverity(opt.key as any)}
                    className={`rounded-xl border-2 p-4 text-center transition-all hover:shadow-sm ${severity === opt.key ? opt.sel : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className="text-2xl mb-2">{opt.icon}</div>
                    <div className={`font-semibold text-sm ${severity === opt.key ? opt.txt : 'text-slate-800'}`}>{opt.label}</div>
                    <div className="text-xs text-slate-500 mt-1 leading-tight">{opt.desc}</div>
                  </button>
                ))}
              </div>

              {severity && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5 text-sm text-slate-600">
                  Based on your symptoms and severity, we'll look for hospitals with <strong>{bedTypeLabel}</strong> availability.
                </div>
              )}

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

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && severity && (
            <div className="p-6">
              <p className="text-lg font-semibold text-slate-800 mb-1">Confirm & find hospitals</p>
              <p className="text-sm text-slate-500 mb-5">We'll show only hospitals equipped for your case, ranked by proximity and data freshness.</p>

              {isCritical && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800">Critical case detected</p>
                    <p className="text-xs text-red-600">Consider calling 108 (Ambulance) immediately while we route you.</p>
                  </div>
                  <a href="tel:108" className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex-shrink-0">
                    <Phone className="w-3.5 h-3.5" /> 108
                  </a>
                </div>
              )}

              {/* Summary */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200 mb-6">
                <div className="p-4">
                  <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Symptoms selected</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(selectedSymptoms).map(s => (
                      <span key={s} className="text-xs bg-white border border-slate-300 text-slate-700 px-2 py-1 rounded-lg">{s}</span>
                    ))}
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
                  <span className="text-sm text-slate-500">Bed type needed</span>
                  <span className="text-sm font-semibold text-slate-800">{bedTypeLabel}</span>
                </div>
                <div className="flex justify-between items-center p-4">
                  <span className="text-sm text-slate-500">Specialist wards to match</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {Array.from(selectedCats).map(cat => (
                      <span key={cat} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{cat}</span>
                    ))}
                  </div>
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

        <p className="text-center text-xs text-slate-400 mt-5">For life-threatening emergencies always call <strong>108</strong> first</p>
      </div>
    </div>
  );
}