import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, RotateCcw, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-xl">L</span>
            </div>
          </Link>

          <div className="w-16 h-16 rounded-[20px] bg-primary/10 flex items-center justify-center mx-auto mb-6">
            {isSent ? (
              <CheckCircle className="w-8 h-8 text-secondary" />
            ) : (
              <Mail className="w-8 h-8 text-primary" />
            )}
          </div>

          <h1 className="text-3xl font-heading font-bold text-foreground">
            {isSent ? "Check your email" : "Reset your password"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isSent
              ? <>We sent a reset link to <span className="font-semibold text-foreground">{email}</span></>
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        <div className="card-soft !p-8">
          {isSent ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-secondary/10 rounded-2xl p-4 text-center">
                <p className="text-sm text-foreground">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>

              <button onClick={() => setIsSent(false)} className="btn-accent w-full flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" /> Try another email
              </button>
            </motion.div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    className="input-soft !pl-11"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!email || isSending}
                className="btn-accent w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <><RotateCcw className="w-4 h-4 animate-spin" /> Sending…</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Reset Link</>
                )}
              </button>
            </form>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
