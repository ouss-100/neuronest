"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { images } from "@/assets/assets";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const rules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    {
      label: "Passwords match",
      met: password.length > 0 && password === confirmPassword,
    },
  ];

  const allMet = rules.every((r) => r.met);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allMet) return;
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
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
            {isSuccess ? "Password updated!" : "Set new password"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isSuccess
              ? "Your password has been reset successfully"
              : "Create a strong password for your account"}
          </p>
        </div>

        <div className="card-soft !p-8">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-secondary/10 rounded-2xl p-5 text-center space-y-2">
                <p className="text-sm text-foreground font-medium">
                  You're all set!
                </p>
                <p className="text-sm text-muted-foreground">
                  You can now sign in with your new password.
                </p>
              </div>

              <Link
                href="/login"
                className="btn-accent w-full flex items-center justify-center gap-2"
              >
                Go to Sign In <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  New password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    className="input-soft !pl-11 !pr-11"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    className="input-soft !pl-11 !pr-11"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password strength rules */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {rules.map((rule) => (
                  <div key={rule.label} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${rule.met ? "bg-secondary" : "bg-muted"}`}
                    >
                      {rule.met && (
                        <CheckCircle className="w-3 h-3 text-secondary-foreground" />
                      )}
                    </div>
                    <span
                      className={`text-xs transition-colors ${rule.met ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={!allMet || isResetting}
                className="btn-accent w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResetting ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" /> Updating…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Reset Password
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
