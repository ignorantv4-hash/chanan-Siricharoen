import React, { useState } from 'react';
import { PatientRecord, DispositionType, TriageLevel } from '../types';
import { X, Save, Clock, Activity, CheckCircle2, Hospital } from 'lucide-react';

interface EditModalProps {
  record: PatientRecord | null;
  onClose: () => void;
  onSave: (updatedRecord: PatientRecord) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ record, onClose, onSave }) => {
  if (!record) return null;

  const [patientName, setPatientName] = useState(record.patientName);
  const [bibNumber, setBibNumber] = useState(record.bibNumber);
  const [patientAge, setPatientAge] = useState(record.patientAge);
  const [gender, setGender] = useState(record.gender);
  const [diagnosis, setDiagnosis] = useState(record.diagnosis);
  const [disposition, setDisposition] = useState<DispositionType>(record.disposition);
  const [triageLevel, setTriageLevel] = useState<TriageLevel>(record.triageLevel);
  const [departureTime, setDepartureTime] = useState(record.departureTime);
  const [hospitalReferredTo, setHospitalReferredTo] = useState(record.hospitalReferredTo || '');
  const [evaluatorName, setEvaluatorName] = useState(record.evaluatorName);
  const [notes, setNotes] = useState(record.notes || '');
  const [bp, setBp] = useState(record.vitals.bp || '');
  const [hr, setHr] = useState(record.vitals.hr || '');
  const [spo2, setSpo2] = useState(record.vitals.spo2 || '');

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PatientRecord = {
      ...record,
      patientName,
      bibNumber,
      patientAge,
      gender,
      diagnosis,
      disposition,
      triageLevel,
      departureTime,
      hospitalReferredTo,
      evaluatorName,
      notes,
      vitals: {
        ...record.vitals,
        bp,
        hr,
        spo2,
      },
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-300">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-[#142038] text-white px-5 py-3.5 flex justify-between items-center">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span>แก้ไขข้อมูลเวชระเบียน</span>
              <span className="text-[#d92525] font-mono bg-white px-2 py-0.5 rounded text-xs font-black">
                {record.bibNumber}
              </span>
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4 text-xs">
            {/* Row 1: Name & BIB */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">ชื่อ - สกุล ผู้ป่วย</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">หมายเลข BIB</label>
                <input
                  type="text"
                  required
                  value={bibNumber}
                  onChange={(e) => setBibNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-[#d92525]"
                />
              </div>
            </div>

            {/* Row 2: Vitals Quick Edit */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] text-slate-500 font-medium">BP (mmHg)</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80"
                  className="w-full p-1.5 border rounded bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-medium">HR (bpm)</label>
                <input
                  type="number"
                  value={hr}
                  onChange={(e) => setHr(e.target.value)}
                  placeholder="80"
                  className="w-full p-1.5 border rounded bg-white text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-medium">SpO2 (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  placeholder="98"
                  className="w-full p-1.5 border rounded bg-white text-xs font-bold"
                />
              </div>
            </div>

            {/* Row 3: Diagnosis */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Diagnosis (การวินิจฉัย)</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            {/* Row 4: Disposition */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                Disposition (ผลการจำหน่าย)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDisposition('Discharge')}
                  className={`p-2 rounded-lg border font-semibold text-center transition ${
                    disposition === 'Discharge'
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Discharge
                </button>
                <button
                  type="button"
                  onClick={() => setDisposition('Hospital')}
                  className={`p-2 rounded-lg border font-semibold text-center transition ${
                    disposition === 'Hospital'
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Hospital (ส่งต่อ)
                </button>
                <button
                  type="button"
                  onClick={() => setDisposition('Observe')}
                  className={`p-2 rounded-lg border font-semibold text-center transition ${
                    disposition === 'Observe'
                      ? 'bg-amber-500 text-slate-900 border-amber-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Observe (เฝ้าระวัง)
                </button>
              </div>

              {disposition === 'Hospital' && (
                <div className="mt-2">
                  <label className="block text-red-700 font-semibold mb-1">โรงพยาบาลที่ส่งต่อ :</label>
                  <input
                    type="text"
                    value={hospitalReferredTo}
                    onChange={(e) => setHospitalReferredTo(e.target.value)}
                    placeholder="เช่น รพ.ศูนย์ประจำจังหวัด"
                    className="w-full p-2 border border-red-300 rounded-lg bg-red-50/50"
                  />
                </div>
              )}
            </div>

            {/* Row 5: Departure Time & Evaluator */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">เวลาออกจากจุดบริการ</label>
                <div className="flex gap-1">
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setDepartureTime(getCurrentTime())}
                    className="px-2 bg-slate-200 hover:bg-slate-300 rounded text-[11px] font-semibold"
                  >
                    ตอนนี้
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">ผู้ประเมิน / พยาบาล</label>
                <input
                  type="text"
                  required
                  value={evaluatorName}
                  onChange={(e) => setEvaluatorName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Row 6: Notes */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">หมายเหตุเพิ่มเติม</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-100 px-5 py-3 flex justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#142038] hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>บันทึกการแก้ไข</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
