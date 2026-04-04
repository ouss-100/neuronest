interface BaseUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: {
    countryCode: string;
    number: string;
  };
}

export interface DoctorRegisterInput extends BaseUser {
  role: "DOCTOR";
  specialty: string;
  latitude: number;
  longitude: number;
  identityCard: string;
}

export interface ParentRegisterInput extends BaseUser {
  role: "PARENT";
}

export type RegisterInput = DoctorRegisterInput | ParentRegisterInput;
