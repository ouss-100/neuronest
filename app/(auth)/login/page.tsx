"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { images } from "@/assets/assets";
import { fadeUp } from "@/lib/animations";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user?.role) {
        const role = session.user.role;
        if (role === "admin") router.replace("/admin");
        else if (role === "doctor") router.replace("/doctor");
        else if (role === "parent") router.replace("/parent");
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    const session = await getSession();
    const role = session?.user?.role;

    if (role === "admin") router.push("/admin");
    else if (role === "doctor") router.push("/doctor");
    else if (role === "parent") router.push("/parent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="w-full max-w-md">
        <motion.div {...fadeUp()} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src={images.logo} alt="Logo" className="w-15 h-10 object-contain" priority />
            <span className="font-heading font-bold text-xl text-foreground">
              neuro<span className="text-primary">nest</span>
            </span>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-foreground">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to continue your journey</p>
        </motion.div>

        <motion.div {...fadeUp(1)} className="card-soft p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <motion.div {...fadeUp(2)} className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  className="input-soft pl-11"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.div {...fadeUp(3)} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary font-semibold hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  className="input-soft pl-11 pr-11"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

            <motion.button {...fadeUp(4)} type="submit" className="btn-accent w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"} <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <motion.p {...fadeUp(5)} className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Create one</Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;