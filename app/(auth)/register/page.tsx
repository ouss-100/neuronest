"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  Stethoscope,
  Users,
  Star,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { fadeUp } from "@/lib/animations";
import { images } from "@/assets/assets";
import { registerUser } from "@/server/auth/register";
import CountryCodeSelect from "@/components/CountryCodeSelect";
import { RegisterInput } from "@/types/RegisterInput";

const roles = [
  {
    value: "PARENT",
    label: "Parent",
    icon: Users,
    desc: "Track your child's development",
  },
  {
    value: "DOCTOR",
    label: "Doctor",
    icon: Stethoscope,
    desc: "Evaluate and support patients",
  },
];

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
});

const Register = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("PARENT");
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    specialty: "",
    latitude: "",
    longitude: "",
    identityCard: null as File | null,
  });

  const passwordRules = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "One number", met: /\d/.test(formData.password) },
  ];

  const allPasswordRulesMet = passwordRules.every((r) => r.met);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files?.[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allPasswordRulesMet) return;

    setErrorMessage("");

    let payload: RegisterInput;

    if (selectedRole === "DOCTOR") {
      payload = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: {
          countryCode,
          number: formData.phone,
        },
        role: "DOCTOR",
        specialty: formData.specialty,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        identityCard: formData.identityCard?.name || "",
      };
    } else {
      payload = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: {
          countryCode,
          number: formData.phone,
        },
        role: "PARENT",
      };
    }

    try {
      const res = await registerUser(payload);

      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }

      // ✅ pass userId
      router.push(`/OTP-verification`);
    } catch (err: any) {
      setErrorMessage("Unexpected error");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div {...fadeUp()} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image
              src={images.logo}
              alt="LearnBright Logo"
              className="w-15 h-10 object-contain"
              priority
            />
            <span className="font-heading font-bold text-xl text-foreground">
              neuro<span className="text-primary">nest</span>
            </span>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Create your account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Let's discover how your child learns best
          </p>
        </motion.div>

        {/* Form */}
        <motion.div {...fadeUp(1)} className="card-soft p-8!">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Role selector */}
            <motion.div {...fadeUp(2)}>
              <label className="text-sm font-body font-medium text-foreground mb-2 block">
                Choose your account type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRole(r.value)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      selectedRole === r.value
                        ? "border-primary bg-bloom-periwinkle-light"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <r.icon
                      className={`w-5 h-5 mx-auto mb-1 ${
                        selectedRole === r.value
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <p className="text-sm font-display font-semibold text-foreground">
                      {r.label}
                    </p>
                    <p className="text-xs text-muted-foreground font-body">
                      {r.desc}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>

            {selectedRole === "PARENT" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-soft w-full"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-soft w-full"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Phone Number
                  </label>

                  <div className="flex w-full items-stretch">
                    <CountryCodeSelect
                      value={countryCode}
                      onChange={setCountryCode}
                    />

                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-soft w-full h-12 pl-10 rounded-l-none"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-soft pl-11! w-full"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-soft pl-11! w-full"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                    {passwordRules.map((rule) => (
                      <div key={rule.label} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                            rule.met ? "bg-secondary" : "bg-muted"
                          }`}
                        >
                          {rule.met && (
                            <CheckCircle className="w-3 h-3 text-secondary-foreground" />
                          )}
                        </div>
                        <span
                          className={`text-xs transition-colors ${
                            rule.met
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {selectedRole === "DOCTOR" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-soft w-full"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-soft w-full"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-soft pl-11 w-full"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">
                      Phone Number
                    </label>

                    <div className="flex w-full items-stretch">
                      <CountryCodeSelect
                        value={countryCode}
                        onChange={setCountryCode}
                      />

                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                        <input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="input-soft w-full h-12 pl-10 rounded-l-none"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="input-soft pl-11 w-full"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                      {passwordRules.map((rule) => (
                        <div
                          key={rule.label}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              rule.met ? "bg-secondary" : "bg-muted"
                            }`}
                          >
                            {rule.met && (
                              <CheckCircle className="w-3 h-3 text-secondary-foreground" />
                            )}
                          </div>
                          <span
                            className={`text-xs ${
                              rule.met
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {rule.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground">
                      Specialty
                    </label>
                    <div className="relative">
                      <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        className="input-soft pl-11 w-full"
                        placeholder="e.g., Pediatrician"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Upload Identity Card
                  </label>

                  <div className="flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 px-3 py-4">
                    <div className="text-center">
                      <div className="mt-2 flex flex-col items-center text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="identityCard"
                          className="cursor-pointer font-semibold text-primary hover:text-primary/80"
                        >
                          Choose file
                          <input
                            id="identityCard"
                            name="identityCard"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleInputChange}
                            className="sr-only"
                            required
                          />
                        </label>
                        <p className="text-xs mt-1">PNG, JPG, PDF (max 10MB)</p>
                      </div>

                      {formData.identityCard && (
                        <p className="text-xs text-green-600 mt-2 truncate max-w-[150px]">
                          {formData.identityCard.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Select Your Location
                  </label>

                  <MapPicker
                    position={mapPosition}
                    onSelect={(lat, lng) => {
                      setMapPosition([lat, lng]);
                      setFormData((prev) => ({
                        ...prev,
                        latitude: lat.toString(),
                        longitude: lng.toString(),
                      }));
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!navigator.geolocation) {
                        alert("Geolocation is not supported");
                        return;
                      }

                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const lat = pos.coords.latitude;
                          const lng = pos.coords.longitude;

                          setMapPosition([lat, lng]);

                          setFormData((prev) => ({
                            ...prev,
                            latitude: lat.toString(),
                            longitude: lng.toString(),
                          }));
                        },
                        () => alert("Failed to get location"),
                      );
                    }}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    Get my current location
                  </button>
                </div>
              </motion.div>
            )}

            <motion.button
              {...fadeUp(7)}
              type="submit"
              className="btn-accent w-full flex items-center justify-center gap-2 mt-6"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.button>
            {errorMessage && (
              <div className="text-red-500 text-sm font-medium text-center">
                {errorMessage}
              </div>
            )}
          </form>

          <motion.p
            {...fadeUp(8)}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
