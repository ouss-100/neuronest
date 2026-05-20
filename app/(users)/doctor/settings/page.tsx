"use client";

import { motion } from "framer-motion";
import { Save, User, Bell, Stethoscope, Mail, Phone, MapPin, Award, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { getDoctorProfile, updateDoctorProfile } from "@/server/profileActions";
import { MOCK_DOCTOR_ID } from "@/lib/constants";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function DoctorSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    location: "Riyadh, Saudi Arabia", // default/static
    specialty: "Developmental Pediatrics",
    identityCard: "",
    yearsOfExperience: "12",
    bio: "Board-certified developmental pediatrician specializing in early childhood assessments.",
  });

  const [notifications, setNotifications] = useState({
    newAssignments: true,
    appointmentReminders: true,
    reportUpdates: true,
    parentMessages: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const [availability, setAvailability] = useState({
    consultationDuration: "30 minutes",
    maxDailyAppointments: "8",
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getDoctorProfile(MOCK_DOCTOR_ID);
      if (res.success && res.doctor) {
        setProfile({
          firstname: res.doctor.firstname || "",
          lastname: res.doctor.lastname || "",
          email: res.doctor.email || "",
          phone: res.doctor.phone?.number || "",
          location: "Riyadh, Saudi Arabia",
          specialty: res.doctor.specialty || "Developmental Pediatrics",
          identityCard: res.doctor.identityCard || "",
          yearsOfExperience: "12",
          bio: "Board-certified developmental pediatrician specializing in early childhood assessments.",
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (field: string) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await updateDoctorProfile(MOCK_DOCTOR_ID, {
      firstname: profile.firstname,
      lastname: profile.lastname,
      email: profile.email,
      phone: { countryCode: "+1", number: profile.phone },
      specialty: profile.specialty,
      identityCard: profile.identityCard,
    });
    setSaving(false);
    if (res.success) {
      toast.success("Settings saved", { description: "Your profile and preferences have been updated." });
    } else {
      toast.error("Error", { description: "Failed to update profile." });
    }
  };

  const Toggle = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-12 h-7 rounded-full transition-colors duration-200 relative ${checked ? "bg-primary" : "bg-muted"}`}
    >
      <span className={`absolute top-0.5 w-6 h-6 bg-card rounded-full shadow transition-transform duration-200 ${checked ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );

  const notificationItems = [
    { key: "newAssignments", label: "New Patient Assignments", desc: "Get notified when a new child is assigned to you" },
    { key: "appointmentReminders", label: "Appointment Reminders", desc: "Receive reminders before upcoming appointments" },
    { key: "reportUpdates", label: "Report Updates", desc: "Alerts when assessment reports are ready for review" },
    { key: "parentMessages", label: "Parent Messages", desc: "Notifications for new messages from parents" },
    { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of activity and pending tasks each week" },
    { key: "marketingEmails", label: "Marketing & Updates", desc: "Product updates and feature announcements" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Toaster />
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile, specialization, and preferences</p>
      </div>

      {/* Profile Information */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-soft space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-foreground">Profile Information</h2>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold font-heading">
            {profile.firstname?.[0]}{profile.lastname?.[0]}
          </div>
          <div>
            <p className="font-heading font-semibold text-foreground">Dr. {profile.firstname} {profile.lastname}</p>
            <p className="text-sm text-muted-foreground">{profile.specialty}</p>
            <button className="text-xs text-primary font-medium mt-1 hover:underline">Change Photo</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-muted-foreground" /> First Name</label>
            <input className="input-soft" value={profile.firstname} onChange={(e) => handleProfileChange("firstname", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-muted-foreground" /> Last Name</label>
            <input className="input-soft" value={profile.lastname} onChange={(e) => handleProfileChange("lastname", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email</label>
            <input className="input-soft" value={profile.email} onChange={(e) => handleProfileChange("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-muted-foreground" /> Phone</label>
            <input className="input-soft" value={profile.phone} onChange={(e) => handleProfileChange("phone", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Location</label>
            <input className="input-soft" value={profile.location} onChange={(e) => handleProfileChange("location", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Bio</label>
          <textarea className="input-soft min-h-[80px] resize-none" value={profile.bio} onChange={(e) => handleProfileChange("bio", e.target.value)} />
        </div>
      </motion.div>

      {/* Specialization */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-soft space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-foreground">Specialization & Credentials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Specialization</label>
            <select className="input-soft" value={profile.specialty} onChange={(e) => handleProfileChange("specialty", e.target.value)}>
              <option>Neurologist</option>
              <option>Speech Therapist</option>
              <option>Child Psychologist</option>
              <option>Pediatric Neurologist</option>
              <option>Developmental Pediatrics</option>
              <option>Occupational Therapy</option>
              <option>Behavioral Therapy</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-muted-foreground" /> License / Identity Card</label>
            <input className="input-soft" value={profile.identityCard} onChange={(e) => handleProfileChange("identityCard", e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Years of Experience</label>
            <input className="input-soft" type="number" value={profile.yearsOfExperience} onChange={(e) => handleProfileChange("yearsOfExperience", e.target.value)} />
          </div>
        </div>
      </motion.div>

      {/* Availability */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-soft space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-foreground">Availability</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Consultation Duration</label>
            <select className="input-soft" value={availability.consultationDuration} onChange={(e) => setAvailability((p) => ({ ...p, consultationDuration: e.target.value }))}>
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>45 minutes</option>
              <option>60 minutes</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Max Daily Appointments</label>
            <input className="input-soft" type="number" value={availability.maxDailyAppointments} onChange={(e) => setAvailability((p) => ({ ...p, maxDailyAppointments: e.target.value }))} />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-soft space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-foreground">Notification Preferences</h2>
        </div>

        {notificationItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Toggle checked={notifications[item.key as keyof typeof notifications]} onToggle={() => handleNotificationToggle(item.key)} />
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleSave}
        disabled={saving}
        className="btn-accent flex items-center gap-2"
      >
        <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
      </motion.button>
    </div>
  );
}
