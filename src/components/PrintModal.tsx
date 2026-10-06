import React from 'react';
import { PatientRecord } from '../types';
import { WalkRunBikeLogo } from './WalkRunBikeLogo';
import { Printer, X, CheckCircle2, Building2, Activity } from 'lucide-react';

interface PrintModalProps {
  record: PatientRecord | null;
  onClose: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const symptomsList = [...record.symptoms, record.symptomOther].filter(Boolean).join(', ');

  // Format treatments list
  const treatmentsList: string[] = [];
  if (record.treatments?.oralHydration) treatmentsList.push('Oral hydration');
  if (record.treatments?.ice) treatmentsList.push('ICE (ประคบเย็น)');
  if (record.treatments?.massage) treatmentsList.push('Massage (นวด)');
  if (record.treatments?.woundDressing) treatmentsList.push('ทำแผล (Wound dressing)');
  if (record.treatments?.oxygenTherapy) treatmentsList.push('Oxygen therapy');
  if (record.treatments?.sprayRelief) treatmentsList.push('สเปรย์บรรเทาปวด');

  if (record.treatments?.ivFluid?.enabled) {
    treatmentsList.push(
      `IV fluid: ${record.treatments.ivFluid.type} [${record.treatments.ivFluid.amount}] ${
        record.treatments.ivFluid.rate ? `(${record.treatments.ivFluid.rate})` : ''
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
  if (record.treatments?.other) {
    treatmentsList.push(record.treatments.other);
  }

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-300">
        
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="bg-[#142038] text-white px-5 py-3 flex justify-between items-center no-print">
          <div className="flex items-center space-x-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold">ใบเวชระเบียนการปฐมพยาบาล (First Aid Service Chart)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Paper Area */}
        <div className="p-6 sm:p-8 overflow-y-auto print-container space-y-4 text-xs text-slate-900">
          
          {/* Official Header */}
          <div className="flex justify-between items-start border-b-2 border-[#142038] pb-4">
            <div className="space-y-1">
              <div className="w-44 h-12 mb-1">
                <WalkRunBikeLogo className="w-full h-full" />
              </div>
              <h2 className="font-bold text-sm text-[#142038]">
                โครงการ "แสงนำใจไทยทั้งชาติ เดิน วิ่ง ปั่น ป้องกันอัมพาต ครั้งที่ 12 เฉลิมพระเกียรติ"
              </h2>
              <p className="text-slate-600 font-medium">
                แบบบันทึกเวชระเบียนการปฐมพยาบาล (First Aid Incident & Medical Record)
              </p>
              <p className="text-[11px] text-slate-500">
                จุดบริการ: {record.stationName} | วันที่บันทึก:{' '}
                {new Date(record.createdAt).toLocaleDateString('th-TH')}
              </p>
            </div>

            {/* BIB Number Box */}
            <div className="text-right border-2 border-slate-300 p-2.5 rounded-xl bg-slate-50 min-w-[110px]">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                BIB NUMBER
              </span>
              <span className="text-2xl font-black text-[#d92525] font-mono block">
                {record.bibNumber}
              </span>
              <span className="text-[10px] text-slate-600 block mt-0.5">
                {record.eventCategory}
              </span>
            </div>
          </div>

          {/* Section 1: Patient Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px]">ชื่อผู้ป่วย:</span>
              <strong className="text-sm text-slate-900">{record.patientName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">อายุ / เพศ:</span>
              <strong>{record.patientAge} ปี ({record.gender})</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">เวลาที่เข้า:</span>
              <strong>{record.arrivalTime} น.</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">การเดินทางมา:</span>
              <strong>{record.arrivalMethod}</strong>
            </div>
          </div>

          {/* Section 2 & 3: Complaints & Medical History */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-slate-200 p-3 rounded-xl">
              <span className="font-bold text-[#142038] block border-b pb-1 mb-1">
                อาการสำคัญ (Chief Complaints)
              </span>
              <p className="leading-relaxed text-slate-800">{symptomsList || 'ไม่มีการระบุ'}</p>
            </div>

            <div className="border border-slate-200 p-3 rounded-xl">
              <span className="font-bold text-[#142038] block border-b pb-1 mb-1">
                ประวัติโรคประจำตัว / ยาที่ทาน / ประวัติแพ้ยา
              </span>
              <p className="leading-relaxed text-slate-800">
                {record.hasHistory === 'มี'
                  ? record.historyDetail || 'มีประวัติแต่ไม่ได้ระบุรายละเอียด'
                  : 'ไม่มีประวัติโรคประจำตัวหรือแพ้ยา'}
              </p>
            </div>
          </div>

          {/* Section 4: Vital Signs & Exam */}
          <div className="border border-slate-200 p-3 rounded-xl space-y-2">
            <span className="font-bold text-[#142038] block border-b pb-1">
              ข้อมูลการตรวจร่างกาย & สัญญาณชีพ (Physical Exam & Vital Signs)
            </span>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center bg-slate-100 p-2 rounded-lg font-mono text-[11px]">
              <div>
                <span className="block text-[10px] text-slate-500">BP (mmHg)</span>
                <span className="font-bold text-slate-900">{record.vitals.bp || '-'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">HR (bpm)</span>
                <span className="font-bold text-slate-900">{record.vitals.hr || '-'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">RR (/min)</span>
                <span className="font-bold text-slate-900">{record.vitals.rr || '-'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">SpO2 (%)</span>
                <span className="font-bold text-slate-900">{record.vitals.spo2 || '-'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">Temp (°C)</span>
                <span className="font-bold text-slate-900">{record.vitals.temp || '-'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500">DTX (mg/dL)</span>
                <span className="font-bold text-slate-900">{record.vitals.dtx || '-'}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700">ผลตรวจร่างกาย / LAB / EKG:</span>{' '}
              <span className="text-slate-800">
                {record.physicalExamNotes || 'ปกติ / ไม่มีข้อสังเกตเพิ่มเติม'}
              </span>
            </div>
          </div>

          {/* Section 5: Treatments */}
          <div className="border border-slate-200 p-3 rounded-xl">
            <span className="font-bold text-[#142038] block border-b pb-1 mb-1">
              การรักษาพยาบาลที่ได้รับ (Treatments & Medications)
            </span>
            <p className="leading-relaxed font-semibold text-[#142038]">
              {treatmentsList.join(', ') || 'ให้การพักผ่อน / ปฐมพยาบาลเบื้องต้น'}
            </p>
          </div>

          {/* Section 6: Disposition & Assessment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-slate-200 p-3 rounded-xl bg-slate-50">
            <div>
              <p className="mb-1">
                <strong>Diagnosis :</strong>{' '}
                <span className="font-bold text-[#d92525]">{record.diagnosis}</span>
              </p>
              <p className="mb-1">
                <strong>Disposition :</strong>{' '}
                <span className="font-bold underline text-slate-900">{record.disposition}</span>
              </p>
              {record.disposition === 'Hospital' && (
                <div className="text-xs text-red-700 font-semibold mt-1">
                  ส่งต่อ รพ. : {record.hospitalReferredTo || 'รพ.ศูนย์'} | โดย:{' '}
                  {record.ambulanceUnit || 'EMS 1669'}
                </div>
              )}
              {record.notes && (
                <p className="mt-1 text-slate-600">
                  <strong>หมายเหตุ :</strong> {record.notes}
                </p>
              )}
            </div>

            <div className="text-right sm:text-right flex flex-col justify-end">
              <p className="mb-4">
                <strong>เวลาออกจากจุดบริการ :</strong> {record.departureTime || '-'} น.
              </p>
              <div className="border-t border-slate-300 pt-2 inline-block">
                <p className="text-center font-medium">ลงชื่อผู้ประเมิน / แพทย์ / พยาบาล</p>
                <p className="text-center font-bold text-slate-900 mt-1">
                  ({record.evaluatorName})
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Action Buttons (Hidden when printing) */}
        <div className="bg-slate-100 px-6 py-3 flex justify-end gap-2.5 no-print border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            ปิดหน้าต่าง
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 bg-[#d92525] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์เอกสาร (Print Chart)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
