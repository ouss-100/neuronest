"use client";

import { motion } from "framer-motion";
import { Save, Bell, Shield, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const AdminSettings = () => {
  const [platformName, setPlatformName] = useState("LearnBright");
  const [supportEmail, setSupportEmail] = useState("support@learnbright.com");
  const [duration, setDuration] = useState("10 minutes");
  const [notifications, setNotifications] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved", {
      description: "Your changes have been applied successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Toaster />

      <div>
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Platform configuration and preferences
        </p>
      </div>

      {/* General */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-soft space-y-5"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-foreground">
            General
          </h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Platform Name
          </label>
          <input
            className="input-soft"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Support Email
          </label>
          <input
            className="input-soft"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Default Assessment Duration
          </label>
          <select
            className="input-soft"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option>5 minutes</option>
            <option>10 minutes</option>
            <option>15 minutes</option>
            <option>20 minutes</option>
          </select>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-soft space-y-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-foreground">
            Notifications
          </h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
          <div>
            <p className="text-sm font-medium text-foreground">
              Email Notifications
            </p>
            <p className="text-xs text-muted-foreground">
              Receive alerts for new registrations and assessments
            </p>
          </div>

          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-7 rounded-full transition-colors duration-200 relative ${
              notifications ? "bg-secondary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 bg-card rounded-full shadow transition-transform duration-200 ${
                notifications ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
          <div>
            <p className="text-sm font-medium text-foreground">
              Maintenance Mode
            </p>
            <p className="text-xs text-muted-foreground">
              Temporarily disable access for non-admin users
            </p>
          </div>

          <button
            onClick={() => setMaintenance(!maintenance)}
            className={`w-12 h-7 rounded-full transition-colors duration-200 relative ${
              maintenance ? "bg-accent" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 bg-card rounded-full shadow transition-transform duration-200 ${
                maintenance ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-soft space-y-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-lg text-foreground">
            Security
          </h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
          <div>
            <p className="text-sm font-medium text-foreground">
              Two-Factor Authentication
            </p>
            <p className="text-xs text-muted-foreground">
              Require 2FA for all admin accounts
            </p>
          </div>
          <span className="badge-completed text-xs">Enabled</span>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30">
          <div>
            <p className="text-sm font-medium text-foreground">
              Session Timeout
            </p>
            <p className="text-xs text-muted-foreground">
              Auto-logout after inactivity
            </p>
          </div>
          <span className="text-sm font-heading font-semibold text-foreground">
            30 minutes
          </span>
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

export default AdminSettings;
