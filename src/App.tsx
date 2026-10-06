/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PatientRecord } from './types';
import { INITIAL_RECORDS, AID_STATIONS } from './data/sampleData';
import { Header } from './components/Header';
import { RecordForm } from './components/RecordForm';
import { PatientTable } from './components/PatientTable';
import { DashboardView } from './components/DashboardView';
import { PrintModal } from './components/PrintModal';
import { EditModal } from './components/EditModal';
import { ViewModal } from './components/ViewModal';
import { CheckCircle2, AlertTriangle, Info, Bell } from 'lucide-react';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'warning' | 'info';
}

export default function App() {
  // Persistence Key
  const STORAGE_KEY = 'wb12_first_aid_records';
  const STATION_KEY = 'wb12_aid_station';

  // State
  const [records, setRecords] = useState<PatientRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse localStorage records', e);
    }
    return INITIAL_RECORDS;
  });

  const [currentStation, setCurrentStation] = useState<string>(() => {
    return localStorage.getItem(STATION_KEY) || AID_STATIONS[0];
  });

  const [currentTab, setCurrentTab] = useState<'form' | 'list' | 'dashboard'>('form');

  // Modals
  const [printRecord, setPrintRecord] = useState<PatientRecord | null>(null);
  const [editRecord, setEditRecord] = useState<PatientRecord | null>(null);
  const [viewRecord, setViewRecord] = useState<PatientRecord | null>(null);

  // Toast
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success',
  });

  // Hidden File input ref for JSON restore
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save records to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Could not save to localStorage', e);
    }
  }, [records]);

  // Save current station
  useEffect(() => {
    localStorage.setItem(STATION_KEY, currentStation);
  }, [currentStation]);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  // Add new patient record
  const handleSaveRecord = (newRecord: PatientRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
    showToast(`บันทึกข้อมูล BIB: ${newRecord.bibNumber} สำเร็จแล้ว`, 'success');
    setCurrentTab('list');
  };

  // Update existing record
  const handleUpdateRecord = (updated: PatientRecord) => {
    setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setEditRecord(null);
    showToast(`อัปเดตข้อมูล BIB: ${updated.bibNumber} เรียบร้อย`, 'success');
  };

  // Delete patient record
  const handleDeleteRecord = (id: string) => {
    const target = records.find((r) => r.id === id);
    const bib = target ? target.bibNumber : '';
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบเวชระเบียนของ BIB: ${bib}?`)) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      showToast(`ลบข้อมูลเวชระเบียนเรียบร้อย`, 'info');
    }
  };

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    if (records.length === 0) {
      showToast('ไม่มีข้อมูลสำหรับส่งออกเป็น CSV', 'warning');
      return;
    }

    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent +=
      'ID,วันที่บันทึก,จุดบริการ,เวลาเข้า,หมายเลข BIB,ชื่อผู้ป่วย,อายุ,เพศ,ประเภทกิจกรรม,วิธีเดินทางมา,Triage,อาการสำคัญ,อาการเพิ่มเติม,ประวัติโรคประจำตัวและแพ้ยา,BP,HR,RR,SpO2,Temp,DTX,การตรวจร่างกาย,การรักษาที่ได้รับ,Diagnosis,Disposition,รพ.ที่ส่งต่อ,เวลาออก,ผู้ประเมิน,หมายเหตุ\n';

    records.forEach((r) => {
      const symptomsStr = r.symptoms.join('; ');

      // Build treatments string
      const txs: string[] = [];
      if (r.treatments?.oralHydration) txs.push('Oral hydration');
      if (r.treatments?.ice) txs.push('ICE');
      if (r.treatments?.massage) txs.push('Massage');
      if (r.treatments?.woundDressing) txs.push('Wound dressing');
      if (r.treatments?.oxygenTherapy) txs.push('Oxygen therapy');
      if (r.treatments?.sprayRelief) txs.push('Pain relief spray');
      if (r.treatments?.ivFluid?.enabled) {
        txs.push(`IV ${r.treatments.ivFluid.type} ${r.treatments.ivFluid.amount}`);
      }
      if (r.treatments?.ivPlasil) txs.push('IV Plasil');
      if (r.treatments?.paracetamol?.enabled) {
        txs.push(`Paracetamol ${r.treatments.paracetamol.dose}mg`);
      }
      if (r.treatments?.ibuprofen?.enabled) {
        txs.push(`Ibuprofen ${r.treatments.ibuprofen.dose}mg`);
      }
      if (r.treatments?.aspirin?.enabled) {
        txs.push(`Aspirin ${r.treatments.aspirin.dose}mg`);
      }
      if (r.treatments?.other) txs.push(r.treatments.other);

      const treatmentsStr = txs.join('; ');

      const row = [
        `"${r.id}"`,
        `"${new Date(r.createdAt).toLocaleString('th-TH')}"`,
        `"${r.stationName}"`,
        `"${r.arrivalTime}"`,
        `"${r.bibNumber}"`,
        `"${r.patientName}"`,
        `"${r.patientAge}"`,
        `"${r.gender}"`,
        `"${r.eventCategory}"`,
        `"${r.arrivalMethod}"`,
        `"${r.triageLevel}"`,
        `"${symptomsStr}"`,
        `"${r.symptomOther || ''}"`,
        `"${r.hasHistory === 'มี' ? r.historyDetail : 'ไม่มี'}"`,
        `"${r.vitals.bp || ''}"`,
        `"${r.vitals.hr || ''}"`,
        `"${r.vitals.rr || ''}"`,
        `"${r.vitals.spo2 || ''}"`,
        `"${r.vitals.temp || ''}"`,
        `"${r.vitals.dtx || ''}"`,
        `"${(r.physicalExamNotes || '').replace(/"/g, '""')}"`,
        `"${treatmentsStr.replace(/"/g, '""')}"`,
        `"${(r.diagnosis || '').replace(/"/g, '""')}"`,
        `"${r.disposition}"`,
        `"${r.hospitalReferredTo || ''}"`,
        `"${r.departureTime || ''}"`,
        `"${r.evaluatorName}"`,
        `"${(r.notes || '').replace(/"/g, '""')}"`,
      ].join(',');

      csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.download = `FirstAid_WB12_${dateStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('ดาวน์โหลดไฟล์ CSV เรียบร้อยแล้ว (เปิดใน Excel ได้ทันที)', 'success');
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_FirstAid_WB12_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('สำรองข้อมูล JSON เรียบร้อยแล้ว', 'success');
  };

  // Trigger JSON Import
  const handleTriggerImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle File Input Change for JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          if (
            window.confirm(
              `พบข้อมูลผู้ป่วยจำนวน ${parsed.length} รายการ คุณต้องการแทนที่ฐานข้อมูลปัจจุบันใช่หรือไม่?`
            )
          ) {
            setRecords(parsed);
            showToast(`นำเข้าข้อมูลสำเร็จจำนวน ${parsed.length} รายการ`, 'success');
          }
        } else {
          showToast('รูปแบบไฟล์ JSON ไม่ถูกต้อง', 'warning');
        }
      } catch (err) {
        showToast('ไม่สามารถอ่านไฟล์ JSON ได้', 'warning');
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      {/* Hidden File Input for JSON Restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Official Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        patientCount={records.length}
        currentStation={currentStation}
        setCurrentStation={setCurrentStation}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        onImportJSON={handleTriggerImport}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {currentTab === 'form' && (
          <RecordForm
            currentStation={currentStation}
            onSaveRecord={handleSaveRecord}
            onViewList={() => setCurrentTab('list')}
          />
        )}

        {currentTab === 'list' && (
          <PatientTable
            records={records}
            onOpenPrint={(r) => setPrintRecord(r)}
            onOpenEdit={(r) => setEditRecord(r)}
            onOpenView={(r) => setViewRecord(r)}
            onDeleteRecord={handleDeleteRecord}
            onExportCSV={handleExportCSV}
            onAddNew={() => setCurrentTab('form')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView records={records} onExportCSV={handleExportCSV} />
        )}
      </main>

      {/* Printable / View / Edit Modals */}
      {printRecord && (
        <PrintModal record={printRecord} onClose={() => setPrintRecord(null)} />
      )}

      {editRecord && (
        <EditModal
          record={editRecord}
          onClose={() => setEditRecord(null)}
          onSave={handleUpdateRecord}
        />
      )}

      {viewRecord && (
        <ViewModal
          record={viewRecord}
          onClose={() => setViewRecord(null)}
          onEdit={(r) => setEditRecord(r)}
          onPrint={(r) => setPrintRecord(r)}
        />
      )}

      {/* Toast Notification */}
      <div
        className={`fixed bottom-5 right-5 z-50 transition-all duration-300 transform ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#142038] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 text-xs sm:text-sm">
          {toast.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          {toast.type === 'warning' && (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800 text-center no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <p>
            โครงการแสงนำใจไทยทั้งชาติ เดิน วิ่ง ปั่น ป้องกันอัมพาต ครั้งที่ 12 เฉลิมพระเกียรติ
          </p>
          <p className="text-slate-500">
            ระบบบันทึกเวชระเบียนหน่วยปฐมพยาบาลภาคสนาม (Online Ready First Aid System)
          </p>
        </div>
      </footer>
    </div>
  );
}
