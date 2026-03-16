"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Stethoscope, Users } from "lucide-react";
import { useState } from "react";
import { fadeUp } from "@/lib/animations";
import { images } from "@/assets/assets";
import { i } from "framer-motion/client";

const roles = [
  {
    value: "parent",
    label: "Parent",
    icon: Users,
    desc: "Track your child's development",
  },
  {
    value: "doctor",
    label: "Doctor",
    icon: Stethoscope,
    desc: "Evaluate and support patients",
  },
];

const Register = () => {
  const [selectedRole, setSelectedRole] = useState("parent");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full max-w-md"
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
        <motion.div {...fadeUp(1)} className="card-soft !p-8">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Role selector */}
            <motion.div {...fadeUp(2)}>
              <label className="text-sm font-body font-medium text-foreground mb-2 block">
                I am a...
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
                      className={`w-5 h-5 mx-auto mb-1 ${selectedRole === r.value ? "text-primary" : "text-muted-foreground"}`}
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

            {/* Name */}
            <motion.div {...fadeUp(3)} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  First name
                </label>
                <input className="input-soft" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Last name
                </label>
                <input className="input-soft" placeholder="Doe" />
              </div>
            </motion.div>

            {/* Email & Password */}
            <motion.div {...fadeUp(4)} className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  className="input-soft !pl-11"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
            </motion.div>

            <motion.div {...fadeUp(5)} className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  className="input-soft !pl-11"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button
              {...fadeUp(6)}
              type="submit"
              className="btn-accent w-full flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <motion.p
            {...fadeUp(7)}
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
