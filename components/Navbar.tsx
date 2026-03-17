"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { images } from "@/assets/assets";
import Image from "next/image";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Resources", to: "/resources" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container-narrow flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`font-heading font-semibold text-sm transition-colors duration-200 ${
                pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons + Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="btn-outline-primary !px-5 !py-2.5 text-sm"
          >
            Log In
          </Link>
          <Link href="/register" className="btn-accent !px-5 !py-2.5 text-sm">
            Get Started
          </Link>

          {/* Theme Toggle Button */}
          <ThemeToggle className="ml-2" />
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />

          <button
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-card"
          >
            <div className="container-narrow py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`font-heading font-semibold py-2 ${
                    pathname === link.to
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex gap-3 pt-2">
                <Link
                  href="/login"
                  className="btn-outline-primary !px-5 !py-2.5 text-sm flex-1 text-center"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="btn-accent !px-5 !py-2.5 text-sm flex-1 text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
