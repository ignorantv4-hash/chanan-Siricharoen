import React, { useState } from 'react';
import {
  PatientRecord,
  TriageLevel,
  DispositionType,
  ArrivalMethodType,
  EventCategoryType,
} from '../types';
import { COMMON_SYMPTOMS, COMMON_DIAGNOSES } from '../data/sampleData';
import {
  ClipboardPlus,
  Clock,
  User,
  Hash,
  HeartPulse,
  Activity,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  Save,
  CheckCircle2,
  Syringe,
  Pill,
  Hospital,
  Flame,
} from 'lucide-react';

interface RecordFormProps {
  currentStation: string;
  onSaveRecord: (record: PatientRecord) => void;
  onViewList: () => void;
}

export const RecordForm: React.FC<RecordFormProps> = ({
  currentStation,
  onSaveRecord,
  onViewList,
}) => {
  // Helpers
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
  };

  // State
  const [patientName, setPatientName] = useState('');
  const [bibNumber, setBibNumber] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [gender, setGender] = useState<'ชาย' | 'หญิง' | 'ไม่ระบุ'>('ไม่ระบุ');
  const [eventCategory, setEventCategory] = useState<EventCategoryType>('Run');
  const [arrivalTime, setArrivalTime] = useState(getCurrentTime());
  const [arrivalMethod, setArrivalMethod] = useState<ArrivalMethodType>('Finish line');
  const [triageLevel, setTriageLevel] = useState<TriageLevel>('green');

  // Symptoms
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomOther, setSymptomOther] = useState('');

  // History
  const [hasHistory, setHasHistory] = useState<'ไม่มี' | 'มี'>('ไม่มี');
  const [historyDetail, setHistoryDetail] = useState('');

  // Vitals
  const [vitals, setVitals] = useState({
    bp: '',
    hr: '',
    rr: '',
    spo2: '',
    temp: '',
    dtx: '',
  });
  const [physicalExamNotes, setPhysicalExamNotes] = useState('');

  // Treatments
  const [treatments, setTreatments] = useState({
    oralHydration: false,
    ice: false,
    massage: false,
    woundDressing: false,
    oxygenTherapy: false,
    sprayRelief: false,
    ivFluid: {
      enabled: false,
      type: 'NSS',
      amount: '500 ml',
      rate: '',
    },
    ivPlasil: false,
    paracetamol: { enabled: false, dose: '500' },
    ibuprofen: { enabled: false, dose: '400' },
    aspirin: { enabled: false, dose: '300' },
    other: '',
  });

  // Assessment & Plan
  const [disposition, setDisposition] = useState<DispositionType>('Discharge');
  const [hospitalReferredTo, setHospitalReferredTo] = useState('');
  const [ambulanceUnit, setAmbulanceUnit] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [evaluatorName, setEvaluatorName] = useState('');
  const [notes, setNotes] = useState('');

  // Handlers for symptom selection
  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((item) => item !== symptom)
        : [...prev, symptom]
    );
  };

  // Preset Template Fillers
  const applyPreset = (type: 'cramp' | 'heat' | 'fall' | 'cardiac') => {
    if (type === 'cramp') {
      setSelectedSymptoms((prev) => Array.from(new Set([...prev, 'ตะคริว'])));
      setTreatments((prev) => ({
        ...prev,
        ice: true,
        massage: true,
        oralHydration: true,
        sprayRelief: true,
        paracetamol: { enabled: true, dose: '500' },
      }));
      setDiagnosis('Muscle Cramp (ตะคริวกล้ามเนื้อ)');
      setTriageLevel('green');
      setPhysicalExamNotes((prev) => prev || 'กล้ามเนื้อน่อง/ต้นขาเกร็งตัว ปวดตึง');
    } else if (type === 'heat') {
      setSelectedSymptoms((prev) =>
        Array.from(new Set([...prev, 'อ่อนเพลีย', 'มึนเวียนศีรษะ', 'คลื่นไส้/อาเจียน']))
      );
      setTreatments((prev) => ({
        ...prev,
        ice: true,
        oralHydration: true,
        ivFluid: { enabled: true, type: 'NSS', amount: '500 ml', rate: 'Normal Drip' },
      }));
      setDiagnosis('Heat Exhaustion (เพลียแดดจากความร้อน/ขาดน้ำ)');
      setTriageLevel('yellow');
      setPhysicalExamNotes((prev) => prev || 'ผิวหนังแดง ร้อน มีเหงื่อออกมาก อ่อนเพลีย');
    } else if (type === 'fall') {
      setSelectedSymptoms((prev) =>
        Array.from(new Set([...prev, 'มีอุบัติเหตุ / เลือดออก / บาดแผล']))
      );
      setTreatments((prev) => ({
        ...prev,
        woundDressing: true,
        ice: true,
        paracetamol: { enabled: true, dose: '500' },
      }));
      setDiagnosis('Multiple Abrasion Wounds (แผลถลอกจากการล้ม)');
      setTriageLevel('green');
      setPhysicalExamNotes((prev) => prev || 'แผลถลอกตื้น ไม่มีกระดูกหัก เลือดหยุดไหลดี');
    } else if (type === 'cardiac') {
      setSelectedSymptoms((prev) =>
        Array.from(new Set([...prev, 'เจ็บหน้าอก', 'หายใจไม่อิ่ม / หายใจเร็ว', 'อ่อนเพลีย']))
      );
      setTreatments((prev) => ({
        ...prev,
        oxygenTherapy: true,
        aspirin: { enabled: true, dose: '300' },
        ivFluid: { enabled: true, type: 'NSS', amount: '500 ml', rate: 'Keep vein open' },
      }));
      setDisposition('Hospital');
      setTriageLevel('red');
      setDiagnosis('Suspected Acute Coronary Syndrome (สงสัยกล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน)');
      setHospitalReferredTo('รพ.ศูนย์ (Stroke & Chest Pain Fast Track 1669)');
      setPhysicalExamNotes((prev) => prev || 'เจ็บแน่นหน้าอกเหมือนมีอะไรกดทับ เหงื่อแตกตัวเย็น ซีด');
    }
  };

  const handleReset = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลในฟอร์มทั้งหมดใช่หรือไม่?')) {
      setPatientName('');
      setBibNumber('');
      setPatientAge('');
      setGender('ไม่ระบุ');
      setEventCategory('Run');
      setArrivalTime(getCurrentTime());
      setArrivalMethod('Finish line');
      setTriageLevel('green');
      setSelectedSymptoms([]);
      setSymptomOther('');
      setHasHistory('ไม่มี');
      setHistoryDetail('');
      setVitals({ bp: '', hr: '', rr: '', spo2: '', temp: '', dtx: '' });
      setPhysicalExamNotes('');
      setTreatments({
        oralHydration: false,
        ice: false,
        massage: false,
        woundDressing: false,
        oxygenTherapy: false,
        sprayRelief: false,
        ivFluid: { enabled: false, type: 'NSS', amount: '500 ml', rate: '' },
        ivPlasil: false,
        paracetamol: { enabled: false, dose: '500' },
        ibuprofen: { enabled: false, dose: '400' },
        aspirin: { enabled: false, dose: '300' },
        other: '',
      });
      setDisposition('Discharge');
      setHospitalReferredTo('');
      setAmbulanceUnit('');
      setDiagnosis('');
      setDepartureTime('');
      setNotes('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      alert('กรุณาระบุชื่อ - สกุล ผู้ป่วย');
      return;
    }
    if (!bibNumber.trim()) {
      alert('กรุณาระบุหมายเลข BIB');
      return;
    }
    if (!evaluatorName.trim()) {
      alert('กรุณาระบุชื่อผู้ประเมิน / แพทย์ / พยาบาล');
      return;
    }

    const newRecord: PatientRecord = {
      id: 'REC-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
      stationName: currentStation,
      patientName: patientName.trim(),
      bibNumber: bibNumber.trim(),
      patientAge: patientAge.trim() || '-',
      gender,
      eventCategory,
      arrivalTime,
      arrivalMethod,
      triageLevel,
      symptoms: selectedSymptoms,
      symptomOther: symptomOther.trim(),
      hasHistory,
      historyDetail: historyDetail.trim(),
      vitals,
      physicalExamNotes: physicalExamNotes.trim(),
      treatments,
      disposition,
      hospitalReferredTo: hospitalReferredTo.trim(),
      ambulanceUnit: ambulanceUnit.trim(),
      diagnosis: diagnosis.trim() || 'อาการทั่วไป',
      departureTime: departureTime.trim() || getCurrentTime(),
      evaluatorName: evaluatorName.trim(),
      notes: notes.trim(),
    };

    onSaveRecord(newRecord);
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Presets */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              ปุ่มลัดอาการที่พบบ่อย (Quick Injury Presets)
            </h3>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              คลิกเพื่อเติมข้อมูลการรักษาอัตโนมัติอย่างรวดเร็ว
            </span>
          </div>
          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
            Fast Track Aid
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset('cramp')}
            className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl border border-blue-200 text-left transition flex items-center gap-2 text-xs font-semibold"
          >
            <Activity className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="block font-bold">ตะคริวกล้ามเนื้อ</span>
              <span className="text-[10px] text-blue-600 font-normal">ประคบเย็น/นวด/เกลือแร่</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('heat')}
            className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200 text-left transition flex items-center gap-2 text-xs font-semibold"
          >
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="block font-bold">เพลียแดด / ขาดน้ำ</span>
              <span className="text-[10px] text-amber-600 font-normal">IV NSS/ประคบเย็น/พักผ่อน</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('fall')}
            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-200 text-left transition flex items-center gap-2 text-xs font-semibold"
          >
            <AlertTriangle className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="block font-bold">หกล้ม / แผลถลอก</span>
              <span className="text-[10px] text-emerald-600 font-normal">ทำแผล/ล้างNSS/พารา</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('cardiac')}
            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-900 rounded-xl border border-red-300 text-left transition flex items-center gap-2 text-xs font-semibold"
          >
            <HeartPulse className="w-4 h-4 text-red-600 shrink-0" />
            <div>
              <span className="block font-bold text-red-700">เจ็บแน่นหน้าอก (ACS)</span>
              <span className="text-[10px] text-red-600 font-normal">O2/Aspirin/ส่งต่อ รพ.</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Medical Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200"
      >
        {/* Form Title Header */}
        <div className="bg-[#142038] text-white px-6 py-4 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center space-x-2.5">
            <ClipboardPlus className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">แบบบันทึกข้อมูลผู้เข้ารับการปฐมพยาบาล</h2>
              <p className="text-[11px] text-slate-300">
                จุดบริการ: <span className="text-amber-300 font-medium">{currentStation}</span>
              </p>
            </div>
          </div>

          {/* Triage Level Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
            <span className="text-[11px] font-semibold text-slate-300 px-2">ระดับ Triage:</span>
            <button
              type="button"
              onClick={() => setTriageLevel('green')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                triageLevel === 'green'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              เขียว (ทั่วไป)
            </button>
            <button
              type="button"
              onClick={() => setTriageLevel('yellow')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                triageLevel === 'yellow'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              เหลือง (เร่งด่วน)
            </button>
            <button
              type="button"
              onClick={() => setTriageLevel('red')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                triageLevel === 'red'
                  ? 'bg-[#d92525] text-white shadow animate-pulse'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              แดง (วิกฤต)
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-7">
          
          {/* SECTION 1: Patient Details */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 relative">
            <div className="absolute -top-3 left-4 bg-[#142038] text-white text-xs font-bold px-3 py-0.5 rounded-md shadow-sm">
              ส่วนที่ 1 : ข้อมูลของผู้ป่วย
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mt-2">
              {/* Patient Name */}
              <div className="lg:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อ - สกุล ผู้ป่วย <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="นาย / นาง / นางสาว..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#142038] focus:outline-none"
                  />
                </div>
              </div>

              {/* BIB Number */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  หมายเลข BIB <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Hash className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={bibNumber}
                    onChange={(e) => setBibNumber(e.target.value)}
                    placeholder="เช่น A1024"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono font-bold text-[#d92525] focus:ring-2 focus:ring-[#142038] focus:outline-none"
                  />
                </div>
              </div>

              {/* Arrival Time */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  เวลาเข้า <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="time"
                    required
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#142038] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setArrivalTime(getCurrentTime())}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg whitespace-nowrap transition"
                  >
                    ตอนนี้
                  </button>
                </div>
              </div>

              {/* Age & Gender */}
              <div className="lg:col-span-3 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">อายุ (ปี)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="ระบุอายุ"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#142038] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">เพศ</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-2 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#142038] focus:outline-none"
                  >
                    <option value="ไม่ระบุ">ไม่ระบุ</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                  </select>
                </div>
              </div>

              {/* Race Category */}
              <div className="lg:col-span-4">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ประเภทกิจกรรม
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs font-medium">
                  {(['Run', 'Walk', 'Bike', 'VIP / เจ้าหน้าที่'] as EventCategoryType[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEventCategory(cat)}
                      className={`py-1.5 px-2 rounded-lg border text-center transition ${
                        eventCategory === cat
                          ? 'bg-[#142038] text-white border-[#142038] font-bold shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arrival Method */}
              <div className="lg:col-span-8">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ผู้ป่วยมาจาก (วิธีเดินทางมาจุดบริการ)
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    { label: 'Finish line', icon: '🏁' },
                    { label: 'รถ Ambulance', icon: '🚑' },
                    { label: 'เดินเข้ามาเอง', icon: '🚶' },
                    { label: 'หน่วยปฐมพยาบาลเคลื่อนที่', icon: '🛵' },
                    { label: 'เจ้าหน้าที่นำส่ง', icon: '👥' },
                  ].map((m) => (
                    <label
                      key={m.label}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg border cursor-pointer transition ${
                        arrivalMethod === m.label
                          ? 'bg-blue-50 border-[#142038] text-[#142038] font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="arrivalMethod"
                        value={m.label}
                        checked={arrivalMethod === m.label}
                        onChange={() => setArrivalMethod(m.label as ArrivalMethodType)}
                        className="sr-only"
                      />
                      <span className="mr-1.5">{m.icon}</span>
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Chief Complaints */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 relative">
            <div className="absolute -top-3 left-4 bg-[#142038] text-white text-xs font-bold px-3 py-0.5 rounded-md shadow-sm">
              ส่วนที่ 2 : อาการสำคัญ (Chief Complaints)
            </div>
            <p className="text-xs text-slate-500 mb-3 mt-1">* สามารถเลือกได้มากกว่า 1 รายการ</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {COMMON_SYMPTOMS.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                const isUrgent =
                  symptom.includes('เจ็บหน้าอก') ||
                  symptom.includes('หายใจ') ||
                  symptom.includes('การรับรู้ตัว');

                return (
                  <label
                    key={symptom}
                    className={`flex items-start p-2.5 rounded-lg border cursor-pointer text-xs transition ${
                      isSelected
                        ? isUrgent
                          ? 'bg-red-50 border-red-400 text-red-900 font-bold shadow-xs'
                          : 'bg-blue-50 border-blue-400 text-[#142038] font-bold shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSymptom(symptom)}
                      className="mt-0.5 w-4 h-4 text-[#d92525] rounded border-slate-300 focus:ring-[#d92525]"
                    />
                    <span className="ml-2 leading-tight">{symptom}</span>
                  </label>
                );
              })}
            </div>

            {/* Other Symptoms */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                อาการอื่น ๆ เพิ่มเติม (ระบุ)
              </label>
              <input
                type="text"
                value={symptomOther}
                onChange={(e) => setSymptomOther(e.target.value)}
                placeholder="ระบุอาการเพิ่มเติม เช่น ตะคริวที่แฮมสตริงซ้าย, มีอาการเวียนศีรษะร่วมกับชาปลายมือ..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#142038] focus:outline-none"
              />
            </div>
          </div>

          {/* SECTION 3: Medical History / Allergy */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 relative">
            <div className="absolute -top-3 left-4 bg-[#142038] text-white text-xs font-bold px-3 py-0.5 rounded-md shadow-sm">
              ส่วนที่ 3 : ประวัติ / ยาที่ทาน / ประวัติแพ้ยา
            </div>
            <div className="mt-2 space-y-3">
              <div className="flex items-center gap-6 text-sm">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasHistory"
                    value="ไม่มี"
                    checked={hasHistory === 'ไม่มี'}
                    onChange={() => setHasHistory('ไม่มี')}
                    className="text-[#d92525] focus:ring-[#d92525]"
                  />
                  <span className="ml-2 font-medium text-slate-700">
                    ไม่มีประวัติการแพ้ยา / ไม่มีโรคประจำตัว
                  </span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="hasHistory"
                    value="มี"
                    checked={hasHistory === 'มี'}
                    onChange={() => setHasHistory('มี')}
                    className="text-[#d92525] focus:ring-[#d92525]"
                  />
                  <span className="ml-2 font-bold text-red-600">มี (ระบุรายละเอียด)</span>
                </label>
              </div>

              {hasHistory === 'มี' && (
                <div>
                  <textarea
                    rows={2}
                    value={historyDetail}
                    onChange={(e) => setHistoryDetail(e.target.value)}
                    placeholder="ระบุโรคประจำตัว (เช่น ความดัน, เบาหวาน, โรคหัวใจ), ยาประจำที่ทาน หรือยาที่แพ้ (เช่น Penicillin)..."
                    className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg bg-red-50/50 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: Physical Examination & Vitals & LAB */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 relative">
            <div className="absolute -top-3 left-4 bg-[#142038] text-white text-xs font-bold px-3 py-0.5 rounded-md shadow-sm">
              ส่วนที่ 4 : ข้อมูลการตรวจร่างกาย / การตรวจ LAB / สัญญาณชีพ
            </div>

            {/* Vitals Grid */}
            <div className="mt-2 mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 block">BP (mmHg)</span>
                <input
                  type="text"
                  value={vitals.bp}
                  onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                  placeholder="120/80"
                  className="w-full text-center text-sm font-bold text-slate-800 border-b border-slate-300 focus:outline-none py-1"
                />
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 block">Pulse / HR (bpm)</span>
                <input
                  type="number"
                  value={vitals.hr}
                  onChange={(e) => setVitals({ ...vitals, hr: e.target.value })}
                  placeholder="80"
                  className="w-full text-center text-sm font-bold text-slate-800 border-b border-slate-300 focus:outline-none py-1"
                />
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 block">RR (/min)</span>
                <input
                  type="number"
                  value={vitals.rr}
                  onChange={(e) => setVitals({ ...vitals, rr: e.target.value })}
                  placeholder="20"
                  className="w-full text-center text-sm font-bold text-slate-800 border-b border-slate-300 focus:outline-none py-1"
                />
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 block">SpO2 (%)</span>
                <input
                  type="number"
                  value={vitals.spo2}
                  onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                  placeholder="98"
                  className="w-full text-center text-sm font-bold text-slate-800 border-b border-slate-300 focus:outline-none py-1"
                />
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 block">Temp (°C)</span>
                <input
                  type="text"
                  value={vitals.temp}
                  onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                  placeholder="36.8"
                  className="w-full text-center text-sm font-bold text-slate-800 border-b border-slate-300 focus:outline-none py-1"
                />
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 block">DTX (mg/dL)</span>
                <input
                  type="number"
                  value={vitals.dtx}
                  onChange={(e) => setVitals({ ...vitals, dtx: e.target.value })}
                  placeholder="110"
                  className="w-full text-center text-sm font-bold text-slate-800 border-b border-slate-300 focus:outline-none py-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รายละเอียดการตรวจร่างกายเพิ่มเติม / ผลตรวจ LAB (เช่น EKG 12 Leads, แผล, GCS)
              </label>
              <textarea
                rows={2}
                value={physicalExamNotes}
                onChange={(e) => setPhysicalExamNotes(e.target.value)}
                placeholder="ระบุการตรวจร่างกาย เช่น EKG: Normal Sinus, ลักษณะบาดแผลฉีกขาดขนาด 2 cm, ความรู้สึกตัวตื่นดี (GCS E4V5M6)..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#142038] focus:outline-none"
              />
            </div>
          </div>

          {/* SECTION 5: Treatments */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 relative">
            <div className="absolute -top-3 left-4 bg-[#142038] text-white text-xs font-bold px-3 py-0.5 rounded-md shadow-sm">
              ส่วนที่ 5 : Treatments (การรักษาพยาบาล)
            </div>

            <div className="mt-3 space-y-3.5">
              {/* Basic Physical & Non-pharm */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                <label className="flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={treatments.oralHydration}
                    onChange={(e) =>
                      setTreatments({ ...treatments, oralHydration: e.target.checked })
                    }
                    className="w-4 h-4 text-[#d92525] rounded"
                  />
                  <span className="ml-2 font-medium text-slate-800">Oral hydration</span>
                </label>

                <label className="flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={treatments.ice}
                    onChange={(e) => setTreatments({ ...treatments, ice: e.target.checked })}
                    className="w-4 h-4 text-[#d92525] rounded"
                  />
                  <span className="ml-2 font-medium text-slate-800">ICE (ประคบเย็น)</span>
                </label>

                <label className="flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={treatments.massage}
                    onChange={(e) =>
                      setTreatments({ ...treatments, massage: e.target.checked })
                    }
                    className="w-4 h-4 text-[#d92525] rounded"
                  />
                  <span className="ml-2 font-medium text-slate-800">Massage (นวด)</span>
                </label>

                <label className="flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={treatments.woundDressing}
                    onChange={(e) =>
                      setTreatments({ ...treatments, woundDressing: e.target.checked })
                    }
                    className="w-4 h-4 text-[#d92525] rounded"
                  />
                  <span className="ml-2 font-medium text-slate-800">ทำแผล (Dressing)</span>
                </label>

                <label className="flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={treatments.oxygenTherapy}
                    onChange={(e) =>
                      setTreatments({ ...treatments, oxygenTherapy: e.target.checked })
                    }
                    className="w-4 h-4 text-[#d92525] rounded"
                  />
                  <span className="ml-2 font-medium text-slate-800">Oxygen Therapy</span>
                </label>

                <label className="flex items-center p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={treatments.sprayRelief}
                    onChange={(e) =>
                      setTreatments({ ...treatments, sprayRelief: e.target.checked })
                    }
                    className="w-4 h-4 text-[#d92525] rounded"
                  />
                  <span className="ml-2 font-medium text-slate-800">สเปรย์แก้ปวด</span>
                </label>
              </div>

              {/* IV Fluid Box */}
              <div className="bg-white p-3 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={treatments.ivFluid.enabled}
                      onChange={(e) =>
                        setTreatments({
                          ...treatments,
                          ivFluid: { ...treatments.ivFluid, enabled: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-[#d92525] rounded"
                    />
                    <span className="ml-2 text-sm font-bold text-[#142038] flex items-center gap-1.5">
                      <Syringe className="w-4 h-4 text-[#d92525]" />
                      IV Fluid (การให้สารน้ำทางหลอดเลือดดำ)
                    </span>
                  </label>
                  {treatments.ivFluid.enabled && (
                    <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                      ระบุสารน้ำและปริมาตรด้านล่าง
                    </span>
                  )}
                </div>

                {treatments.ivFluid.enabled && (
                  <div className="pl-6 pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">ชนิด Fluid :</label>
                      <select
                        value={treatments.ivFluid.type}
                        onChange={(e) =>
                          setTreatments({
                            ...treatments,
                            ivFluid: { ...treatments.ivFluid, type: e.target.value },
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-1 focus:ring-[#142038]"
                      >
                        <option value="NSS">NSS (0.9% Normal Saline Solution)</option>
                        <option value="3% NaCl">3% NaCl</option>
                        <option value="5% DNSS">5% DNSS</option>
                        <option value="Acetar">Acetar / Lactated Ringer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">ปริมาตร (Amount) :</label>
                      <select
                        value={treatments.ivFluid.amount}
                        onChange={(e) =>
                          setTreatments({
                            ...treatments,
                            ivFluid: { ...treatments.ivFluid, amount: e.target.value },
                          })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-1 focus:ring-[#142038]"
                      >
                        <option value="100 ml">100 ml</option>
                        <option value="250 ml">250 ml</option>
                        <option value="500 ml">500 ml</option>
                        <option value="1 L">1 L (1,000 ml)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">อัตราการให้ (Rate / Note) :</label>
                      <input
                        type="text"
                        value={treatments.ivFluid.rate || ''}
                        onChange={(e) =>
                          setTreatments({
                            ...treatments,
                            ivFluid: { ...treatments.ivFluid, rate: e.target.value },
                          })
                        }
                        placeholder="เช่น 100 ml/hr หรือ Rapid drip"
                        className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-1 focus:ring-[#142038]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Medications Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* IV Plasil */}
                <label className="flex items-center p-2.5 bg-white rounded-lg border border-slate-200 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={treatments.ivPlasil}
                    onChange={(e) =>
                      setTreatments({ ...treatments, ivPlasil: e.target.checked })
                    }
                    className="w-4 h-4 text-[#d92525] rounded"
                  />
                  <span className="ml-2 font-medium text-slate-800">IV Plasil (แก้คลื่นไส้)</span>
                </label>

                {/* Paracetamol */}
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-1 text-xs">
                  <label className="inline-flex items-center font-medium text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={treatments.paracetamol.enabled}
                      onChange={(e) =>
                        setTreatments({
                          ...treatments,
                          paracetamol: {
                            ...treatments.paracetamol,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="mr-1.5 text-[#d92525] rounded"
                    />
                    Paracetamol
                  </label>
                  <div className="flex items-center w-20">
                    <input
                      type="number"
                      value={treatments.paracetamol.dose}
                      onChange={(e) =>
                        setTreatments({
                          ...treatments,
                          paracetamol: {
                            ...treatments.paracetamol,
                            dose: e.target.value,
                          },
                        })
                      }
                      placeholder="500"
                      className="w-full text-xs p-1 border rounded text-right"
                    />
                    <span className="text-[10px] ml-1 text-slate-500">mg</span>
                  </div>
                </div>

                {/* Ibuprofen */}
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-1 text-xs">
                  <label className="inline-flex items-center font-medium text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={treatments.ibuprofen.enabled}
                      onChange={(e) =>
                        setTreatments({
                          ...treatments,
                          ibuprofen: {
                            ...treatments.ibuprofen,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="mr-1.5 text-[#d92525] rounded"
                    />
                    Ibuprofen
                  </label>
                  <div className="flex items-center w-20">
                    <input
                      type="number"
                      value={treatments.ibuprofen.dose}
                      onChange={(e) =>
                        setTreatments({
                          ...treatments,
                          ibuprofen: {
                            ...treatments.ibuprofen,
                            dose: e.target.value,
                          },
                        })
                      }
                      placeholder="400"
                      className="w-full text-xs p-1 border rounded text-right"
                    />
                    <span className="text-[10px] ml-1 text-slate-500">mg</span>
                  </div>
                </div>

                {/* Aspirin */}
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-1 text-xs">
                  <label className="inline-flex items-center font-medium text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={treatments.aspirin.enabled}
                      onChange={(e) =>
                        setTreatments({
                          ...treatments,
                          aspirin: {
                            ...treatments.aspirin,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="mr-1.5 text-[#d92525] rounded"
                    />
                    Aspirin
                  </label>
                  <div className="flex items-center w-20">
                    <input
                      type="number"
                      value={treatments.aspirin.dose}
                      onChange={(e) =>
                        setTreatments({
                          ...treatments,
                          aspirin: {
                            ...treatments.aspirin,
                            dose: e.target.value,
                          },
                        })
                      }
                      placeholder="300"
                      className="w-full text-xs p-1 border rounded text-right"
                    />
                    <span className="text-[10px] ml-1 text-slate-500">mg</span>
                  </div>
                </div>
              </div>

              {/* Other Treatments */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  อื่น ๆ (ระบุการรักษา / หัตถการ หรือยาอื่นเพิ่มเติม)
                </label>
                <input
                  type="text"
                  value={treatments.other}
                  onChange={(e) =>
                    setTreatments({ ...treatments, other: e.target.value })
                  }
                  placeholder="ระบุการรักษาเพิ่มเติม เช่น สเปรย์พ่น, ยาดม, ผงเกลือแร่ ORS 1 ซอง, ยกขาสูง..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#142038] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 6: Assessment & Plan */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 relative">
            <div className="absolute -top-3 left-4 bg-[#142038] text-white text-xs font-bold px-3 py-0.5 rounded-md shadow-sm">
              ส่วนที่ 6 : ผลการประเมินและแผนการรักษา (Assessment & Plan)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {/* Disposition */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Disposition (ผลการจำหน่าย) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <label
                    className={`flex items-center p-2.5 rounded-xl border cursor-pointer transition ${
                      disposition === 'Discharge'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="disposition"
                      value="Discharge"
                      checked={disposition === 'Discharge'}
                      onChange={() => setDisposition('Discharge')}
                      className="sr-only"
                    />
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
                    <span>Discharge (กลับบ้าน)</span>
                  </label>

                  <label
                    className={`flex items-center p-2.5 rounded-xl border cursor-pointer transition ${
                      disposition === 'Hospital'
                        ? 'bg-red-50 border-red-500 text-red-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="disposition"
                      value="Hospital"
                      checked={disposition === 'Hospital'}
                      onChange={() => setDisposition('Hospital')}
                      className="sr-only"
                    />
                    <Hospital className="w-4 h-4 text-red-600 mr-1.5 shrink-0" />
                    <span>Hospital (ส่งต่อ รพ.)</span>
                  </label>

                  <label
                    className={`flex items-center p-2.5 rounded-xl border cursor-pointer transition ${
                      disposition === 'Observe'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="disposition"
                      value="Observe"
                      checked={disposition === 'Observe'}
                      onChange={() => setDisposition('Observe')}
                      className="sr-only"
                    />
                    <Activity className="w-4 h-4 text-amber-600 mr-1.5 shrink-0" />
                    <span>Observe (เฝ้าระวัง)</span>
                  </label>
                </div>

                {/* If Hospital Referral */}
                {disposition === 'Hospital' && (
                  <div className="mt-3 p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-2 text-xs">
                    <div>
                      <label className="block font-bold text-red-800 mb-1">
                        ส่งต่อโรงพยาบาล :
                      </label>
                      <input
                        type="text"
                        value={hospitalReferredTo}
                        onChange={(e) => setHospitalReferredTo(e.target.value)}
                        placeholder="เช่น รพ.ศูนย์ประจำจังหวัด, รพ.ศิริราช, รพ.กรุงเทพ"
                        className="w-full p-2 border border-red-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-red-800 mb-1">
                        รถพยาบาล / หน่วยกู้ชีพที่นำส่ง :
                      </label>
                      <input
                        type="text"
                        value={ambulanceUnit}
                        onChange={(e) => setAmbulanceUnit(e.target.value)}
                        placeholder="เช่น EMS 1669, รถกู้ภัยสว่าง, มูลนิธิร่วมกตัญญู"
                        className="w-full p-2 border border-red-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Diagnosis (การวินิจฉัยโรค)
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="เช่น Heat exhaustion, Muscle Cramp, Dehydration..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#142038] focus:outline-none mb-2"
                />

                {/* Quick diagnosis chips */}
                <div className="flex flex-wrap gap-1 text-[11px]">
                  {COMMON_DIAGNOSES.slice(0, 5).map((diag) => (
                    <button
                      key={diag}
                      type="button"
                      onClick={() => setDiagnosis(diag)}
                      className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition"
                    >
                      {diag.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Departure Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  เวลาที่ออกจากจุดปฐมพยาบาล
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#142038] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setDepartureTime(getCurrentTime())}
                    className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg whitespace-nowrap transition"
                  >
                    ตอนนี้
                  </button>
                </div>
              </div>

              {/* Evaluator Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ลงชื่อผู้ประเมิน / แพทย์ / พยาบาล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={evaluatorName}
                  onChange={(e) => setEvaluatorName(e.target.value)}
                  placeholder="เช่น พญ./นพ. หรือ พว. ผู้ประเมิน"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#142038] focus:outline-none"
                />
              </div>

              {/* Additional Notes */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  หมายเหตุเพิ่มเติม / คำแนะนำหลังการดูแล
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="คำแนะนำ เช่น ให้ดื่มเกลือแร่ 500 ml ภายใน 1 ชั่วโมง, สังเกตอาการปัสสาวะสีเข้ม..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#142038] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ล้างข้อมูลฟอร์ม</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onViewList}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition"
              >
                ดูรายชื่อผู้ป่วย
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#142038] hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg transition flex items-center gap-2 border border-slate-700"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>บันทึกข้อมูลการรักษา</span>
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};
