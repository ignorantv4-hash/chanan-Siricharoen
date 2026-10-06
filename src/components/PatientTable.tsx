import React, { useState, useMemo } from 'react';
import { PatientRecord, DispositionType, TriageLevel } from '../types';
import {
  Search,
  Filter,
  Printer,
  Edit3,
  Trash2,
  FileSpreadsheet,
  Eye,
  AlertCircle,
  Building2,
  Home,
  Clock,
  Activity,
  PlusCircle,
} from 'lucide-react';

interface PatientTableProps {
  records: PatientRecord[];
  onOpenPrint: (record: PatientRecord) => void;
  onOpenEdit: (record: PatientRecord) => void;
  onOpenView: (record: PatientRecord) => void;
  onDeleteRecord: (id: string) => void;
  onExportCSV: () => void;
  onAddNew: () => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  records,
  onOpenPrint,
  onOpenEdit,
  onOpenView,
  onDeleteRecord,
  onExportCSV,
  onAddNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDisposition, setFilterDisposition] = useState<string>('ALL');
  const [filterTriage, setFilterTriage] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.patientName.toLowerCase().includes(q) ||
        r.bibNumber.toLowerCase().includes(q) ||
        r.diagnosis.toLowerCase().includes(q) ||
        r.evaluatorName.toLowerCase().includes(q) ||
        r.symptoms.some((s) => s.toLowerCase().includes(q)) ||
        (r.symptomOther && r.symptomOther.toLowerCase().includes(q)) ||
        r.stationName.toLowerCase().includes(q);

      const matchDisp = filterDisposition === 'ALL' || r.disposition === filterDisposition;
      const matchTriage = filterTriage === 'ALL' || r.triageLevel === filterTriage;
      const matchCategory = filterCategory === 'ALL' || r.eventCategory === filterCategory;

      return matchSearch && matchDisp && matchTriage && matchCategory;
    });
  }, [records, searchTerm, filterDisposition, filterTriage, filterCategory]);

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อผู้ป่วย, หมายเลข BIB, การวินิจฉัย หรืออาการสำคัญ..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#142038] focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Disposition */}
          <select
            aria-label="กรองสถานะการจำหน่าย"
            value={filterDisposition}
            onChange={(e) => setFilterDisposition(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="ALL">สถานะทั้งหมด</option>
            <option value="Discharge">Discharge (กลับบ้าน)</option>
            <option value="Hospital">Hospital (ส่งต่อ รพ.)</option>
            <option value="Observe">Observe (เฝ้าระวัง)</option>
          </select>

          {/* Triage */}
          <select
            aria-label="กรองระดับความเร่งด่วน Triage"
            value={filterTriage}
            onChange={(e) => setFilterTriage(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="ALL">Triage ทั้งหมด</option>
            <option value="green">🟢 เขียว (ทั่วไป)</option>
            <option value="yellow">🟡 เหลือง (เร่งด่วน)</option>
            <option value="red">🔴 แดง (วิกฤต)</option>
          </select>

          {/* Category */}
          <select
            aria-label="กรองประเภทกิจกรรม"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
          >
            <option value="ALL">ทุกกิจกรรม</option>
            <option value="Run">Run (วิ่ง)</option>
            <option value="Walk">Walk (เดิน)</option>
            <option value="Bike">Bike (ปั่น)</option>
          </select>

          {/* Export CSV button */}
          <button
            type="button"
            onClick={onExportCSV}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel / CSV</span>
          </button>

          {/* Add New button */}
          <button
            type="button"
            onClick={onAddNew}
            className="px-3 py-2 bg-[#d92525] hover:bg-red-700 text-white rounded-lg font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">บันทึกรายใหม่</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#142038] text-white font-semibold">
              <tr>
                <th className="p-3 whitespace-nowrap">เวลาเข้า</th>
                <th className="p-3 whitespace-nowrap">BIB</th>
                <th className="p-3 whitespace-nowrap">ชื่อ - สกุล</th>
                <th className="p-3 whitespace-nowrap">อายุ/เพศ</th>
                <th className="p-3 whitespace-nowrap">กิจกรรม</th>
                <th className="p-3 whitespace-nowrap">อาการสำคัญ</th>
                <th className="p-3 whitespace-nowrap">สัญญาณชีพ (BP/HR)</th>
                <th className="p-3 whitespace-nowrap">การวินิจฉัย (Diagnosis)</th>
                <th className="p-3 whitespace-nowrap">Disposition</th>
                <th className="p-3 whitespace-nowrap text-center">จัดการ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => {
                const symptomsSummary = [
                  ...r.symptoms,
                  r.symptomOther,
                ]
                  .filter(Boolean)
                  .join(', ');

                const triageDot =
                  r.triageLevel === 'red'
                    ? 'border-l-4 border-l-red-600 bg-red-50/20'
                    : r.triageLevel === 'yellow'
                    ? 'border-l-4 border-l-amber-500'
                    : 'border-l-4 border-l-emerald-500';

                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-slate-50 transition ${triageDot}`}
                  >
                    {/* Arrival Time */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{r.arrivalTime} น.</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{r.arrivalMethod}</span>
                    </td>

                    {/* BIB */}
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-sm text-[#d92525] bg-red-50 px-2 py-0.5 rounded border border-red-100">
                        {r.bibNumber}
                      </span>
                    </td>

                    {/* Patient Name */}
                    <td className="p-3 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{r.patientName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ผู้ประเมิน: {r.evaluatorName}
                      </span>
                    </td>

                    {/* Age / Gender */}
                    <td className="p-3 whitespace-nowrap text-slate-600">
                      <span>{r.patientAge} ปี</span>
                      <span className="text-[10px] text-slate-400 block">({r.gender})</span>
                    </td>

                    {/* Event Category */}
                    <td className="p-3 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {r.eventCategory}
                      </span>
                    </td>

                    {/* Symptoms */}
                    <td className="p-3 max-w-[200px] truncate" title={symptomsSummary}>
                      <span className="text-slate-800">{symptomsSummary || '-'}</span>
                    </td>

                    {/* Vital Signs (BP/HR) */}
                    <td className="p-3 whitespace-nowrap font-mono text-[11px]">
                      <div>
                        BP: <strong className="text-slate-900">{r.vitals.bp || '-'}</strong>
                      </div>
                      <div className="text-slate-500">
                        HR: {r.vitals.hr || '-'} | SpO2: {r.vitals.spo2 || '-'}%
                      </div>
                    </td>

                    {/* Diagnosis */}
                    <td className="p-3 max-w-[180px] truncate">
                      <span className="font-medium text-slate-800">{r.diagnosis || '-'}</span>
                    </td>

                    {/* Disposition */}
                    <td className="p-3 whitespace-nowrap">
                      {r.disposition === 'Hospital' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded-md text-[11px]">
                          <Building2 className="w-3 h-3" />
                          <span>Hospital</span>
                        </span>
                      ) : r.disposition === 'Observe' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md text-[11px]">
                          <Activity className="w-3 h-3" />
                          <span>Observe</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[11px]">
                          <Home className="w-3 h-3" />
                          <span>Discharge</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        {/* View */}
                        <button
                          type="button"
                          onClick={() => onOpenView(r)}
                          title="ดูรายละเอียดฉบับเต็ม"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Print */}
                        <button
                          type="button"
                          onClick={() => onOpenPrint(r)}
                          title="พิมพ์ใบเวชระเบียนการปฐมพยาบาล"
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => onOpenEdit(r)}
                          title="แก้ไขข้อมูลการรักษา"
                          className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(r.id)}
                          title="ลบรายการนี้"
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">
              ไม่พบข้อมูลผู้เข้ารับการรักษาที่ตรงกับเงื่อนไข
            </p>
            <p className="text-xs text-slate-400">
              ลองเปลี่ยนคำค้นหา หรือกดปุ่ม "บันทึกรายใหม่" เพื่อลงทะเบียนผู้ป่วย
            </p>
            <button
              type="button"
              onClick={onAddNew}
              className="px-4 py-2 bg-[#142038] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ลงทะเบียนรายใหม่</span>
            </button>
          </div>
        )}

        {/* Table Footer info */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <span>
            แสดงทั้งหมด <strong>{filteredRecords.length}</strong> จาก {records.length} รายการ
          </span>
          <span className="hidden sm:inline">
            สัญลักษณ์ Triage: 🟢 เขียว (ทั่วไป) · 🟡 เหลือง (เร่งด่วน) · 🔴 แดง (วิกฤต/ฉุกเฉิน)
          </span>
        </div>
      </div>
    </div>
  );
};
