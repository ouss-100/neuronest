"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname,
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        {/* Big 404 */}
        <div className="relative mb-8">
          <span className="text-[160px] sm:text-[200px] font-heading font-bold text-primary/10 leading-none select-none">
            404
          </span>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-[24px] bg-accent/10 flex items-center justify-center">
              <Search className="w-10 h-10 text-accent" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-3">
          Page not found
        </h1>

        <p className="text-muted-foreground mb-2">
          The page{" "}
          <span className="font-mono text-sm bg-muted px-2 py-1 rounded-lg">
            {pathname}
          </span>{" "}
          doesn't exist or has been moved.
        </p>

        <p className="text-sm text-muted-foreground mb-10">
          Don't worry — let's get you back on track!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-accent flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn-outline-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <div className="mt-12 card-soft !p-6 text-left">
          <div className="flex items-center gap-3 mb-3">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold text-foreground text-sm">
              Looking for something?
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Resources", href: "/resources" },
              { label: "Contact", href: "/contact" },
              { label: "Our Impact", href: "/our-impact" },
              { label: "Login", href: "/login" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-primary hover:underline font-medium py-1"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
