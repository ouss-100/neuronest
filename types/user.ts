export type UserRole = "admin" | "doctor" | "parent";

/* =======================
   BASE INPUT
======================= */
export interface RegisterBaseInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: UserRole;
}

/* =======================
   DOCTOR INPUT
======================= */
export interface RegisterDoctorInput extends RegisterBaseInput {
  role: "doctor";
  phone: string;
  specialty: string;
  latitude: number;
  longitude: number;
  identityCard: File;
}

/* =======================
   PARENT INPUT
======================= */
export interface RegisterParentInput extends RegisterBaseInput {
  role: "parent";
}

/* =======================
   UNION
======================= */
export type RegisterInput = RegisterDoctorInput | RegisterParentInput;

/* =======================
   RESPONSE
======================= */
export type RegisterResponse =
  | {
      success: true;
      message: string;
      verifyToken: string;
    }
  | {
      success: false;
      message: string;
    };
