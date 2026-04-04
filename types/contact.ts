export type Role = "Parent" | "Healthcare professional" | "Other";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: Role | "";
  message: string;
}
