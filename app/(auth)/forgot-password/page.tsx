"use client";

import Link from "next/link";
import Image from "next/image";
import { forgotPassword } from "@/server/auth/forgotPassword";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { images } from "@/assets/assets";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email) return;

  setLoading(true);
  setError("");

  try {
    const res = await forgotPassword(email);

    if (!res.success) {
      setError(res.message || "Something went wrong");
    } else {
      setSuccess(true);
    }
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
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
              alt="NeuroNest Logo"
              className="w-15 h-10 object-contain"
              priority
            />
            <span className="font-heading font-bold text-xl text-foreground">
              neuro<span className="text-primary">nest</span>
            </span>
          </Link>

          <h1 className="text-3xl font-heading font-bold text-foreground">
            {success ? "Check your email" : "Reset your password"}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {success
              ? "We sent you a reset link. Please check your inbox."
              : "We'll send you a reset link"}
          </p>
        </motion.div>

        {/* Card */}
        <motion.div {...fadeUp(1)} className="card-soft p-8!">
          {success ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                If the email exists, a reset link has been sent.
              </p>

              <Link
                href="/login"
                className="btn-accent w-full flex items-center justify-center gap-2"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <motion.div {...fadeUp(2)} className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                  <input
                    className="input-soft pl-11!"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* Button */}
              <motion.button
                {...fadeUp(3)}
                type="submit"
                disabled={loading}
                className="btn-accent w-full disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>
            </form>
          )}

          {/* Back */}
          {!success && (
            <motion.div {...fadeUp(4)}>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;