"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { images } from "@/assets/assets";

const ForgotPassword = () => (
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
          Reset your password
        </h1>
        <p className="mt-2 text-muted-foreground">
          We'll send you a reset link
        </p>
      </motion.div>

      {/* Form */}
      <motion.div {...fadeUp(1)} className="card-soft !p-8">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <motion.div {...fadeUp(2)} className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email address
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

          <motion.button
            {...fadeUp(3)}
            type="submit"
            className="btn-accent w-full"
          >
            Send Reset Link
          </motion.button>
        </form>

        <motion.div {...fadeUp(4)}>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
);

export default ForgotPassword;
