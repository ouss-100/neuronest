import { motion } from "framer-motion";
import { Save, User, Bell, Mail, Phone, MapPin, Shield, Key } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ParentSettings = () => {
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    fullName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 555 123 4567",
    location: "Austin, TX",
    relationship: "Mother",
  });

  const [notifications, setNotifications] = useState({
    assessmentResults: true,
    doctorNotes: true,
    appointmentReminders: true,
    weeklyProgress: true,
    resourceSuggestions: false,
    marketingEmails: false,
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (field: string) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Your preferences have been updated." });
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
    { key: "assessmentResults", label: "Assessment Results", desc: "Get notified when assessment results are ready" },
    { key: "doctorNotes", label: "Doctor Notes", desc: "Alerts when a doctor adds new recommendations" },
    { key: "appointmentReminders", label: "Appointment Reminders", desc: "Reminders before scheduled appointments" },
    { key: "weeklyProgress", label: "Weekly Progress Report", desc: "Receive a weekly summary of your child's progress" },
    { key: "resourceSuggestions", label: "Resource Suggestions", desc: "Personalized learning resources and tips" },
    { key: "marketingEmails", label: "Updates & Newsletters", desc: "Product updates and educational newsletters" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and notification preferences</p>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-soft space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-foreground">Profile Information</h2>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold font-heading">
            SJ
          </div>
          <div>
            <p className="font-heading font-semibold text-foreground">{profile.fullName}</p>
            <p className="text-sm text-muted-foreground">{profile.relationship}</p>
            <button className="text-xs text-primary font-medium mt-1 hover:underline">Change Photo</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-muted-foreground" /> Full Name</label>
            <input className="input-soft" value={profile.fullName} onChange={(e) => handleProfileChange("fullName", e.target.value)} />
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
          <label className="text-sm font-medium text-foreground">Relationship to Children</label>
          <select className="input-soft" value={profile.relationship} onChange={(e) => handleProfileChange("relationship", e.target.value)}>
            <option>Mother</option>
            <option>Father</option>
            <option>Guardian</option>
            <option>Other</option>
          </select>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-soft space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
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

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-soft space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-foreground">Security</h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
          <div className="flex items-center gap-3">
            <Key className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Change Password</p>
              <p className="text-xs text-muted-foreground">Update your account password</p>
            </div>
          </div>
          <button className="text-sm text-primary font-heading font-semibold hover:underline">Update</button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
          <div>
            <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">Add extra security to your account</p>
          </div>
          <span className="text-xs font-heading font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">Not enabled</span>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleSave}
        className="btn-accent flex items-center gap-2"
      >
        <Save className="w-4 h-4" /> Save Changes
      </motion.button>
    </div>
  );
};

export default ParentSettings;
