// patientTypes.ts

// Patient History Interfaces
export interface MedicalCondition {
  condition: string;
  diagnosed_on: string; // Date in YYYY-MM-DD format
  status: "Ongoing" | "Occasional" | "Resolved";
  notes?: string;
}

export interface SurgicalHistory {
  surgery: string;
  date: string; // Date in YYYY-MM-DD format
  notes?: string;
}

export interface FamilyHistory {
  relation: string;
  condition: string;
}

export interface Allergy {
  allergen: string;
  reaction: string;
}

export interface PatientHistory {
  patient_image?: string | any;
  patient_id: number;
  name: string;
  gender: string
  dob: string; // Date of birth in YYYY-MM-DD format
  phone: string;
  address: string;
  medical_history: MedicalCondition[];
  surgical_history: SurgicalHistory[];
  family_history: FamilyHistory[];
  allergies: Allergy[];
  nationality?: string;
  id_card?: string; 
  action?: any
}

// Medical Record Interfaces
export interface Treatment {
  treatment_type: "Medication" | "Medication Adjustment" | "Procedure" | "Therapy";
  medication?: string;
  dosage?: string;
  frequency?: string;
  procedure_name?: string;
  therapy_name?: string;
}

export interface MedicalRecord {
  record_id: number;
  patient_id: number;
  visit_date: string; // Date in YYYY-MM-DD format
  doctor: string;
  department: string;
  reason_for_visit: string;
  diagnosis: string;
  treatments: Treatment[];
  notes?: string;
}
