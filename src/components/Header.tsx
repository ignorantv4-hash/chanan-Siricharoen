import React from 'react';
import { WalkRunBikeLogo } from './WalkRunBikeLogo';
import { AID_STATIONS } from '../data/sampleData';
import {
  FilePlus2,
  Users,
  BarChart3,
  MapPin,
  Clock,
  Wifi,
  Download,
  Upload,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'form' | 'list' | 'dashboard';
  setCurrentTab: (tab: 'form' | 'list' | 'dashboard') => void;
  patientCount: number;
  currentStation: string;
  setCurrentStation: (station: string) => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportJSON: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  patientCount,
  currentStation,
  setCurrentStation,
  onExportCSV,
  onExportJSON,
  onImportJSON,
}) => {
  const [timeStr, setTimeStr] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gradient-to-r from-[#142038] via-[#1b2a4a] to-[#142038] text-white shadow-lg border-b-4 border-[#d92525] sticky top-0 z-30 no-print">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Event Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-1.5 sm:p-2 rounded-xl shadow-md border border-slate-200 shrink-0">
              <WalkRunBikeLogo className="w-28 sm:w-36 h-10 sm:h-12" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#d92525] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                  First Aid Medical Unit
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
                  ออนไลน์พร้อมใช้งาน
                </span>
              </div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-amber-300 leading-snug">
                โครงการ "แสงนำใจไทยทั้งชาติ เดิน วิ่ง ปั่น ป้องกันอัมพาต ครั้งที่ 12 เฉลิมพระเกียรติ"
              </h1>
              <p className="text-xs text-slate-300 hidden md:block">
                ระบบบันทึกเวชระเบียนผู้เข้ารับการปฐมพยาบาลภาคสนาม (Field Medical Registry)
              </p>
            </div>
          </div>

          {/* Station Selector & Time */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Station dropdown */}
            <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
              <select
                aria-label="เลือกจุดบริการปฐมพยาบาล"
                value={currentStation}
                onChange={(e) => setCurrentStation(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
              >
                {AID_STATIONS.map((station) => (
                  <option key={station} value={station} className="bg-slate-900 text-white">
                    {station}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Clock */}
            <div className="hidden sm:flex items-center bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <span>{timeStr} น.</span>
            </div>

            {/* Backup & CSV menu */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onExportCSV}
                title="ดาวน์โหลดข้อมูล CSV สำหรับ Excel"
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition flex items-center gap-1 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">CSV</span>
              </button>
              <button
                type="button"
                onClick={onExportJSON}
                title="สำรองข้อมูล JSON (Backup)"
                className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition flex items-center gap-1 shadow-sm text-xs"
              >
                <span>สำรอง</span>
              </button>
              <button
                type="button"
                onClick={onImportJSON}
                title="นำเข้าข้อมูลสำรอง (Restore)"
                className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition flex items-center gap-1 shadow-sm text-xs"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Navigation Sub-bar */}
      <nav className="bg-white/10 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center overflow-x-auto py-1">
          <div className="flex space-x-1 sm:space-x-2 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setCurrentTab('form')}
              className={`py-2 px-3 sm:px-4 rounded-lg flex items-center gap-2 transition ${
                currentTab === 'form'
                  ? 'bg-[#d92525] text-white shadow-md'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FilePlus2 className="w-4 h-4" />
              <span>แบบฟอร์มบันทึกการปฐมพยาบาล</span>
            </button>

            <button
              onClick={() => setCurrentTab('list')}
              className={`py-2 px-3 sm:px-4 rounded-lg flex items-center gap-2 transition ${
                currentTab === 'list'
                  ? 'bg-[#d92525] text-white shadow-md'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>ประวัติและรายนามผู้ป่วย</span>
              <span className="bg-slate-900/60 text-amber-300 text-xs px-2 py-0.5 rounded-full font-mono">
                {patientCount}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`py-2 px-3 sm:px-4 rounded-lg flex items-center gap-2 transition ${
                currentTab === 'dashboard'
                  ? 'bg-[#d92525] text-white shadow-md'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>สรุปสถิติเวชสารสนเทศ</span>
            </button>
          </div>

          <div className="hidden md:flex items-center text-xs text-slate-300">
            <span>จุด: <strong className="text-amber-300">{currentStation.split(' ')[0]}</strong></span>
          </div>
        </div>
      </nav>
    </header>
  );
};
