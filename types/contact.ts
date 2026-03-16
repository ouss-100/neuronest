export type Role = "Parent" | "Healthcare professional" | "Educator" | "Other";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: Role | "";
  message: string;
}
