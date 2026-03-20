"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyOTP, resendOTP } from "@/server/userActions";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { images } from "@/assets/assets";

const OTPVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const code = otp.join("");
    setIsVerifying(true);
    setMessage("");

    try {
      const res = await verifyOTP(email, code);

      if (res.success) {
        setMessage("Email verified successfully!");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        setMessage(res.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setMessage("");

    try {
      const res = await resendOTP(email);
      if (res.success) {
        setMessage("OTP resent successfully!");
      } else {
        setMessage("Failed to resend OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
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
            Verify your email
          </h1>
          <p className="mt-2 text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-foreground">{email}</span>
          </p>
        </div>

        <div className="card-soft !p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(i, e.target.value.replace(/\D/, ""))
                  }
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-heading font-bold rounded-2xl border border-border/50 bg-muted/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-300"
                />
              ))}
            </div>

            {message && (
              <p
                className={`text-center text-sm mt-2 ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={otp.some((d) => !d) || isVerifying}
              className="btn-accent w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 animate-spin" /> Verifying…
                </span>
              ) : (
                <>
                  Verify Email <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                className="text-primary font-semibold hover:underline"
              >
                Resend code
              </button>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Code expires in 10 minutes
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Wrong email?{" "}
          <Link
            href="/register"
            className="text-primary font-semibold hover:underline"
          >
            Go back
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default OTPVerification;
