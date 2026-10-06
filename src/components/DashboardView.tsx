import React, { useMemo } from 'react';
import { PatientRecord } from '../types';
import {
  Users,
  CheckCircle2,
  Building2,
  Syringe,
  Activity,
  HeartPulse,
  TrendingUp,
  Clock,
  Sparkles,
  Download,
} from 'lucide-react';

interface DashboardViewProps {
  records: PatientRecord[];
  onExportCSV: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ records, onExportCSV }) => {
  // Stats Calculations
  const stats = useMemo(() => {
    const total = records.length;
    const discharge = records.filter((r) => r.disposition === 'Discharge').length;
    const hospital = records.filter((r) => r.disposition === 'Hospital').length;
    const observe = records.filter((r) => r.disposition === 'Observe').length;
    const redTriage = records.filter((r) => r.triageLevel === 'red').length;
    const yellowTriage = records.filter((r) => r.triageLevel === 'yellow').length;
    const greenTriage = records.filter((r) => r.triageLevel === 'green').length;

    const ivCount = records.filter((r) => r.treatments?.ivFluid?.enabled).length;
    const woundCount = records.filter((r) => r.treatments?.woundDressing).length;
    const iceCount = records.filter((r) => r.treatments?.ice).length;
    const massageCount = records.filter((r) => r.treatments?.massage).length;
    const o2Count = records.filter((r) => r.treatments?.oxygenTherapy).length;

    // Symptoms count
    const symptomMap: Record<string, number> = {};
    records.forEach((r) => {
      r.symptoms.forEach((s) => {
        symptomMap[s] = (symptomMap[s] || 0) + 1;
      });
    });

    // Arrival method count
    const arrivalMap: Record<string, number> = {};
    records.forEach((r) => {
      arrivalMap[r.arrivalMethod] = (arrivalMap[r.arrivalMethod] || 0) + 1;
    });

    // Category count
    const categoryMap: Record<string, number> = {};
    records.forEach((r) => {
      categoryMap[r.eventCategory] = (categoryMap[r.eventCategory] || 0) + 1;
    });

    // Hourly buckets (05:00, 06:00, 07:00, 08:00, 09:00, 10:00, 11:00+)
    const hourlyMap: Record<string, number> = {};
    records.forEach((r) => {
      const hour = r.arrivalTime ? r.arrivalTime.split(':')[0] : '00';
      const key = `${hour}:00`;
      hourlyMap[key] = (hourlyMap[key] || 0) + 1;
    });

    return {
      total,
      discharge,
      hospital,
      observe,
      redTriage,
      yellowTriage,
      greenTriage,
      ivCount,
      woundCount,
      iceCount,
      massageCount,
      o2Count,
      symptomMap,
      arrivalMap,
      categoryMap,
      hourlyMap,
    };
  }, [records]);

  const dischargePct = stats.total > 0 ? Math.round((stats.discharge / stats.total) * 100) : 0;
  const hospitalPct = stats.total > 0 ? Math.round((stats.hospital / stats.total) * 100) : 0;
  const ivPct = stats.total > 0 ? Math.round((stats.ivCount / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="bg-gradient-to-r from-[#142038] to-[#203a68] text-white p-5 rounded-2xl shadow-md border border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-900/40 px-2 py-0.5 rounded border border-amber-500/30">
            Medical Informatics & Field Analytics
          </span>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">
            สรุปรายงานเวชสารสนเทศ จุดบริการปฐมพยาบาล
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            โครงการแสงนำใจไทยทั้งชาติ เดิน วิ่ง ปั่น ป้องกันอัมพาต ครั้งที่ 12
          </p>
        </div>

        <button
          type="button"
          onClick={onExportCSV}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>ดาวน์โหลดรายงานฉบับเต็ม (CSV)</span>
        </button>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-[#142038] border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              ผู้เข้ารับบริการทั้งหมด
            </p>
            <h3 className="text-3xl font-extrabold text-[#142038] mt-1 font-mono">
              {stats.total}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              คน (Total Patients Handled)
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-[#142038] rounded-2xl flex items-center justify-center text-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Discharge */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-emerald-500 border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              จำหน่ายกลับบ้าน (Discharge)
            </p>
            <h3 className="text-3xl font-extrabold text-emerald-600 mt-1 font-mono">
              {stats.discharge}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {dischargePct}% ของผู้รับบริการทั้งหมด
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Hospital Referral */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-red-600 border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              ส่งต่อโรงพยาบาล (Hospital)
            </p>
            <h3 className="text-3xl font-extrabold text-red-600 mt-1 font-mono">
              {stats.hospital}
            </h3>
            <p className="text-[11px] text-red-500 font-semibold mt-1">
              {hospitalPct}% (ส่งต่อด้วยรถกู้ชีพ EMS 1669)
            </p>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* IV Fluid */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-amber-500 border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              ให้สารน้ำทางเส้นเลือด (IV)
            </p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-1 font-mono">
              {stats.ivCount}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {ivPct}% (ได้รับ NSS / Lactated / 3% NaCl)
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl">
            <Syringe className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Triage & Clinical Interventions Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#d92525]" />
          <span>การคัดกรองตามระดับความรุนแรง (Triage Distribution)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-800">🟢 ระดับเขียว (Green - ปกติ)</span>
              <p className="text-[11px] text-emerald-600">ปฐมพยาบาลเบื้องต้น/อาการเล็กน้อย</p>
            </div>
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {stats.greenTriage}
            </span>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-800">🟡 ระดับเหลือง (Yellow - เฝ้าระวัง)</span>
              <p className="text-[11px] text-amber-600">ขาดน้ำปานกลาง/บาดแผลลึก/พักสังเกต</p>
            </div>
            <span className="text-2xl font-bold font-mono text-amber-700">
              {stats.yellowTriage}
            </span>
          </div>

          <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-red-800">🔴 ระดับแดง (Red - ฉุกเฉินวิกฤต)</span>
              <p className="text-[11px] text-red-600">สงสัยโรคหัวใจ/Heat stroke/หมดสติ</p>
            </div>
            <span className="text-2xl font-bold font-mono text-red-700">
              {stats.redTriage}
            </span>
          </div>
        </div>
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Symptoms Breakdown */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-sm font-bold text-[#142038] flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-[#d92525]" />
              <span>สรุปจำแนกตามอาการสำคัญ (Symptoms)</span>
            </h4>
            <span className="text-xs text-slate-500">
              {Object.keys(stats.symptomMap).length} กลุ่มอาการ
            </span>
          </div>

          <div className="space-y-3">
            {Object.keys(stats.symptomMap).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">ยังไม่มีข้อมูลอาการ</p>
            ) : (
              Object.entries(stats.symptomMap)
                .sort((a, b) => b[1] - a[1])
                .map(([symptom, count]) => {
                  const pct = Math.round((count / (stats.total || 1)) * 100);
                  const isRed = symptom.includes('เจ็บหน้าอก') || symptom.includes('การรับรู้ตัว');
                  return (
                    <div key={symptom}>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className={isRed ? 'text-red-700 font-bold' : 'text-slate-800'}>
                          {symptom}
                        </span>
                        <span className="font-mono text-slate-600">
                          {count} คน ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isRed ? 'bg-[#d92525]' : 'bg-[#142038]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Arrival Methods & Event Category */}
        <div className="space-y-6">
          {/* Arrival Channels */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-sm font-bold text-[#142038] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>จำแนกตามช่องทางที่ผู้ป่วยเดินทางมา</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(stats.arrivalMap).map(([method, count]) => {
                const pct = Math.round((count / (stats.total || 1)) * 100);
                return (
                  <div
                    key={method}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">{method}</span>
                      <span className="text-[10px] text-slate-400">{pct}% ของทั้งหมด</span>
                    </div>
                    <span className="text-lg font-bold font-mono text-[#142038]">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Treatments Breakdown Pill List */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-[#142038] flex items-center gap-2 border-b pb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>หัตถการและการรักษาที่ให้ (Treatment Interventions)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl text-center border border-slate-200">
                <span className="text-slate-500 text-[11px] block">ประคบเย็น (ICE)</span>
                <span className="text-lg font-bold text-[#142038] font-mono">{stats.iceCount}</span>
                <span className="text-[10px] text-slate-400 block">ราย</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl text-center border border-slate-200">
                <span className="text-slate-500 text-[11px] block">นวดยืดกล้ามเนื้อ</span>
                <span className="text-lg font-bold text-[#142038] font-mono">{stats.massageCount}</span>
                <span className="text-[10px] text-slate-400 block">ราย</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl text-center border border-slate-200">
                <span className="text-slate-500 text-[11px] block">ทำแผล (Dressing)</span>
                <span className="text-lg font-bold text-[#142038] font-mono">{stats.woundCount}</span>
                <span className="text-[10px] text-slate-400 block">ราย</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl text-center border border-slate-200">
                <span className="text-slate-500 text-[11px] block">IV Fluids</span>
                <span className="text-lg font-bold text-[#142038] font-mono">{stats.ivCount}</span>
                <span className="text-[10px] text-slate-400 block">ราย</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl text-center border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Oxygen Therapy</span>
                <span className="text-lg font-bold text-[#142038] font-mono">{stats.o2Count}</span>
                <span className="text-[10px] text-slate-400 block">ราย</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl text-center border border-slate-200">
                <span className="text-slate-500 text-[11px] block">ส่งต่อ รพ. (EMS)</span>
                <span className="text-lg font-bold text-red-600 font-mono">{stats.hospital}</span>
                <span className="text-[10px] text-slate-400 block">ราย</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
