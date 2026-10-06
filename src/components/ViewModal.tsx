import React from 'react';
import { PatientRecord } from '../types';
import {
  X,
  Printer,
  Edit3,
  User,
  HeartPulse,
  Activity,
  Syringe,
  Building2,
  Home,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';

interface ViewModalProps {
  record: PatientRecord | null;
  onClose: () => void;
  onEdit: (record: PatientRecord) => void;
  onPrint: (record: PatientRecord) => void;
}

export const ViewModal: React.FC<ViewModalProps> = ({
  record,
  onClose,
  onEdit,
  onPrint,
}) => {
  if (!record) return null;

  const symptomsList = [...record.symptoms, record.symptomOther].filter(Boolean).join(', ');

  const treatmentsList: string[] = [];
  if (record.treatments?.oralHydration) treatmentsList.push('Oral hydration');
  if (record.treatments?.ice) treatmentsList.push('ICE (ประคบเย็น)');
  if (record.treatments?.massage) treatmentsList.push('Massage (นวด)');
  if (record.treatments?.woundDressing) treatmentsList.push('ทำแผล (Dressing)');
  if (record.treatments?.oxygenTherapy) treatmentsList.push('Oxygen therapy');
  if (record.treatments?.sprayRelief) treatmentsList.push('สเปรย์บรรเทาปวด');

  if (record.treatments?.ivFluid?.enabled) {
    treatmentsList.push(
      `IV fluid: ${record.treatments.ivFluid.type} (${record.treatments.ivFluid.amount}) ${
        record.treatments.ivFluid.rate ? `[${record.treatments.ivFluid.rate}]` : ''
      }`
    );
  }
  if (record.treatments?.ivPlasil) treatmentsList.push('IV Plasil');
  if (record.treatments?.paracetamol?.enabled) {
    treatmentsList.push(`Paracetamol ${record.treatments.paracetamol.dose} mg`);
  }
  if (record.treatments?.ibuprofen?.enabled) {
    treatmentsList.push(`Ibuprofen ${record.treatments.ibuprofen.dose} mg`);
  }
  if (record.treatments?.aspirin?.enabled) {
    treatmentsList.push(`Aspirin ${record.treatments.aspirin.dose} mg`);
  }
  if (record.treatments?.other) treatmentsList.push(record.treatments.other);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-300">
        
        {/* Header */}
        <div className="bg-[#142038] text-white px-5 py-3.5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-sm bg-[#d92525] text-white px-2 py-0.5 rounded">
              {record.bibNumber}
            </span>
            <h3 className="text-sm font-bold">{record.patientName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs text-slate-800 max-h-[80vh] overflow-y-auto">
          
          {/* Quick Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Triage:</span>
              {record.triageLevel === 'red' ? (
                <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-[11px]">
                  🔴 แดง (วิกฤต/ฉุกเฉิน)
                </span>
              ) : record.triageLevel === 'yellow' ? (
                <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">
                  🟡 เหลือง (เร่งด่วน)
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                  🟢 เขียว (ทั่วไป)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">สถานะ:</span>
              {record.disposition === 'Hospital' ? (
                <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                  ส่งต่อโรงพยาบาล
                </span>
              ) : record.disposition === 'Observe' ? (
                <span className="bg-amber-500 text-slate-900 font-bold px-2 py-0.5 rounded text-[11px]">
                  เฝ้าระวังอาการ
                </span>
              ) : (
                <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                  จำหน่ายกลับบ้าน
                </span>
              )}
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 block text-[10px]">อายุ / เพศ</span>
              <p className="font-semibold">{record.patientAge} ปี ({record.gender})</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ประเภทกิจกรรม</span>
              <p className="font-semibold">{record.eventCategory}</p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">เวลาเข้า - ออก</span>
              <p className="font-semibold">
                {record.arrivalTime} น. - {record.departureTime || '-'} น.
              </p>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">การเดินทางมา</span>
              <p className="font-semibold">{record.arrivalMethod}</p>
            </div>
          </div>

          {/* Chief Complaints */}
          <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50">
            <span className="text-slate-500 font-semibold block mb-1">อาการสำคัญ (Chief Complaints)</span>
            <p className="text-slate-900 font-medium">{symptomsList || 'ไม่มี'}</p>
          </div>

          {/* Medical History */}
          <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50">
            <span className="text-slate-500 font-semibold block mb-1">ประวัติโรคประจำตัว / แพ้ยา</span>
            <p className="text-slate-900">
              {record.hasHistory === 'มี' ? record.historyDetail : 'ไม่มีประวัติโรคประจำตัวหรือแพ้ยา'}
            </p>
          </div>

          {/* Vitals */}
          <div className="border border-slate-200 p-3 rounded-xl">
            <span className="text-slate-500 font-semibold block mb-2">สัญญาณชีพ (Vital Signs)</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center bg-slate-100 p-2 rounded-lg font-mono text-[11px]">
              <div>
                <span className="text-[10px] text-slate-500 block">BP</span>
                <span className="font-bold">{record.vitals.bp || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">HR</span>
                <span className="font-bold">{record.vitals.hr || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">RR</span>
                <span className="font-bold">{record.vitals.rr || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">SpO2</span>
                <span className="font-bold">{record.vitals.spo2 || '-'}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Temp</span>
                <span className="font-bold">{record.vitals.temp || '-'}°C</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">DTX</span>
                <span className="font-bold">{record.vitals.dtx || '-'}</span>
              </div>
            </div>
            {record.physicalExamNotes && (
              <p className="mt-2 text-slate-700">
                <strong>ตรวจร่างกาย/LAB:</strong> {record.physicalExamNotes}
              </p>
            )}
          </div>

          {/* Treatments */}
          <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50">
            <span className="text-slate-500 font-semibold block mb-1">การรักษาพยาบาล (Treatments)</span>
            <p className="font-semibold text-[#142038]">
              {treatmentsList.join(', ') || 'ไม่มีหัตถการพิเศษ'}
            </p>
          </div>

          {/* Diagnosis & Staff */}
          <div className="border border-slate-200 p-3 rounded-xl bg-slate-50/50 flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-slate-500 block text-[10px]">Diagnosis (การวินิจฉัย)</span>
              <p className="font-bold text-sm text-[#d92525]">{record.diagnosis}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">ผู้ประเมิน / แพทย์ / พยาบาล</span>
              <p className="font-bold text-slate-800">{record.evaluatorName}</p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-5 py-3 flex justify-end gap-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
          >
            ปิด
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(record);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>แก้ไข</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onPrint(record);
            }}
            className="px-4 py-2 bg-[#d92525] hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์เวชระเบียน</span>
          </button>
        </div>

      </div>
    </div>
  );
};
