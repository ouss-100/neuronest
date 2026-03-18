import bcrypt from "bcryptjs";
import { User, Doctor, Parent } from "@/models/user";

// Function to auto-detect doctor location using IP/geolocation (mocked here for simplicity)
// In production, you could use a real geolocation service
async function detectLocation(): Promise<{
  latitude: number;
  longitude: number;
}> {
  // Mock: center of some city, replace with IP-based detection if needed
  return { latitude: 36.8065, longitude: 10.1815 }; // Tunis coordinates
}

// ------------------------
// REGISTER USER FUNCTION
// ------------------------
export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "parent" | "doctor";
  children?: number;
  phone?: string;
  specialty?: string;
  identityCard?: File | string;
}

export async function registerUser(data: RegisterData) {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create Parent
    if (data.role === "parent") {
      const parent = new Parent({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        role: "parent",
        children: data.children || 0,
      });
      await parent.save();
      return { success: true, user: parent };
    }

    // Create Doctor
    if (data.role === "doctor") {
      if (!data.phone || !data.specialty || !data.identityCard) {
        throw new Error(
          "Doctor must provide phone, specialty, and identity card",
        );
      }

      // Auto-detect location
      const { latitude, longitude } = await detectLocation();

      const doctor = new Doctor({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        role: "doctor",
        phone: data.phone,
        specialty: data.specialty,
        identityCard:
          typeof data.identityCard === "string"
            ? data.identityCard
            : data.identityCard?.name,
        latitude,
        longitude,
      });
      await doctor.save();
      return { success: true, user: doctor };
    }

    throw new Error("Invalid role");
  } catch (error: any) {
    return { success: false, error: error.message || "Registration failed" };
  }
}
