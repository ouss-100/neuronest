import Link from "next/link";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-card border-t border-border/50 py-12">
    <div className="container-narrow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold">L</span>
            </div>
            <span className="font-heading font-bold text-lg text-foreground">LearnBright</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Helping every child discover their unique way of learning.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-bold text-sm text-foreground mb-4">Platform</h4>
          <div className="flex flex-col gap-2">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Resources</Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-bold text-sm text-foreground mb-4">For Parents</h4>
          <div className="flex flex-col gap-2">
            <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Get Started</Link>
            <Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guides</Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-bold text-sm text-foreground mb-4">For Professionals</h4>
          <div className="flex flex-col gap-2">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Doctor Portal</Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Our Mission</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © 2026 LearnBright. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-accent fill-accent" /> for every child
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
