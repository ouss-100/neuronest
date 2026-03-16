"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { fadeUp } from "@/lib/animations";

const Login = () => (
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
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-xl">
              L
            </span>
          </div>
        </Link>
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-muted-foreground">
          Sign in to continue your journey
        </p>
      </motion.div>

      {/* Form */}
      <motion.div {...fadeUp(1)} className="card-soft !p-8">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <motion.div {...fadeUp(2)} className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="input-soft !pl-11"
                type="email"
                placeholder="you@example.com"
              />
            </div>
          </motion.div>

          <motion.div {...fadeUp(3)} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary font-semibold hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="input-soft !pl-11"
                type="password"
                placeholder="••••••••"
              />
            </div>
          </motion.div>

          <motion.button
            {...fadeUp(4)}
            type="submit"
            className="btn-accent w-full flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>

        <motion.p
          {...fadeUp(5)}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-semibold hover:underline"
          >
            Create one
          </Link>
        </motion.p>
      </motion.div>
    </motion.div>
  </div>
);

export default Login;
