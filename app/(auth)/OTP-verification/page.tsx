"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { images } from "@/assets/assets";
import { verifyOTP } from "@/server/auth/verifyOTP";
import { resendOTP } from "@/server/auth/resendOTP";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


const OTPVerificationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [isExpired, setIsExpired] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!userId) {
      setMessage("User ID is missing from URL.");
    }
  }, [userId]);

  /* =======================
     AUTO FOCUS FIRST INPUT
  ======================= */
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* =======================
     TIMER
  ======================= */
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setTimeLeft(180);
    setIsExpired(false);
  };

  /* =======================
     VERIFY OTP
  ======================= */
  const verifyOTPCode = async (code: string) => {
    if (!userId) {
      setMessage("User ID missing. Please register again.");
      return;
    }

    setIsVerifying(true);
    setMessage("");

    try {
      const res = await verifyOTP({ otp: code, userId }); // ✅ pass userId
      if (res.success) {
        setMessage("Email verified successfully!");

        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        setMessage(res.message || "Verification failed");
      }
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (isExpired) return;
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text/plain").trim();
    const pastedCode = pastedData.replace(/\D/g, "");

    if (pastedCode.length === 6) {
      const newOtp = pastedCode.split("");
      setOtp(newOtp);

      inputRefs.current[5]?.focus();

      if (!isExpired) {
        setTimeout(() => {
          verifyOTPCode(pastedCode);
        }, 100);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) return;

    const code = otp.join("");
    if (code.length !== 6) return;

    await verifyOTPCode(code);
  };

  /* =======================
     RESEND OTP
  ======================= */
  const handleResend = async () => {
    if (!userId) return;

    setMessage("");
    setOtp(["", "", "", "", "", ""]);

    try {
      const res = await resendOTP(userId); // ✅ pass userId

      if (res.success) {
        setMessage("OTP resent!");
        resetTimer();
        inputRefs.current[0]?.focus();
      } else {
        setMessage(res.message || "Failed to resend");
      }
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image
              src={images.logo}
              alt="Logo"
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
            We sent a verification code to your email
          </p>
        </div>

        <div className="card-soft p-8!">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={isExpired}
                  onChange={(e) =>
                    handleChange(i, e.target.value.replace(/\D/, ""))
                  }
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border border-border bg-muted/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>

            <p
              className={`text-center text-sm ${
                isExpired ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              {isExpired
                ? "Code expired"
                : `Code expires in ${formatTime(timeLeft)}`}
            </p>

            {message && (
              <p
                className={`text-center text-sm ${
                  message.toLowerCase().includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={otp.some((d) => !d) || isVerifying || isExpired}
              className="btn-accent w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify Email"}
              {!isVerifying && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={handleResend}
              className="text-sm text-primary font-semibold hover:underline"
            >
              Resend code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OTPVerification = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OTPVerificationContent />
    </Suspense>
  );
};

export default OTPVerification;
