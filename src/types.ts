export type TriageLevel = 'green' | 'yellow' | 'red';
export type DispositionType = 'Discharge' | 'Hospital' | 'Observe';
export type ArrivalMethodType = 'Finish line' | 'รถ Ambulance' | 'เดินเข้ามาเอง' | 'หน่วยปฐมพยาบาลเคลื่อนที่' | 'เจ้าหน้าที่นำส่ง';
export type EventCategoryType = 'Walk' | 'Run' | 'Bike' | 'VIP / เจ้าหน้าที่';

export interface VitalSigns {
  bp: string;      // Blood Pressure (mmHg)
  hr: string;      // Heart Rate / Pulse (bpm)
  rr: string;      // Respiratory Rate (/min)
  spo2: string;    // SpO2 (%)
  temp: string;    // Temperature (°C)
  dtx: string;     // Blood Sugar (mg/dL)
}

export interface IVFluidDetails {
  enabled: boolean;
  type: string;    // NSS, 3% NaCl, 5% DNSS, Acetar, etc.
  amount: string;  // 100 ml, 250 ml, 500 ml, 1000 ml
  rate?: string;
}

export interface MedicationItem {
  enabled: boolean;
  dose: string;
}

export interface TreatmentsState {
  oralHydration: boolean;
  ice: boolean;
  massage: boolean;
  woundDressing: boolean;
  oxygenTherapy: boolean;
  sprayRelief: boolean;
  ivFluid: IVFluidDetails;
  ivPlasil: boolean;
  paracetamol: MedicationItem;
  ibuprofen: MedicationItem;
  aspirin: MedicationItem;
  other: string;
}

export interface PatientRecord {
  id: string;
  createdAt: string;       // ISO date
  stationName: string;     // e.g. "จุดปฐมพยาบาลเส้นชัย (Finish Line)"
  patientName: string;
  bibNumber: string;
  patientAge: string;
  gender: 'ชาย' | 'หญิง' | 'ไม่ระบุ';
  eventCategory: EventCategoryType;
  arrivalTime: string;
  arrivalMethod: ArrivalMethodType;
  triageLevel: TriageLevel;
  symptoms: string[];
  symptomOther: string;
  hasHistory: 'ไม่มี' | 'มี';
  historyDetail: string;
  vitals: VitalSigns;
  physicalExamNotes: string;
  treatments: TreatmentsState;
  disposition: DispositionType;
  diagnosis: string;
  hospitalReferredTo?: string;
  ambulanceUnit?: string;
  departureTime: string;
  evaluatorName: string;
  notes?: string;
}
