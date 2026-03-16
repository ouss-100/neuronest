"use client";

import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import PageHero from "@/components/PageHero";
import { assets, sections, ethicsPrinciples } from "@/assets/assets";
import { fadeIn, slideInLeft, fadeInUpOnViewWithDelay } from "@/lib/animations";

const PrivacyPage = () => (
  <PageTransition>
    {/* Hero */}
    <PageHero
      title="Privacy & Ethics"
      subtitle="How we protect your data and uphold ethical standards."
      icon={<Shield className="w-8 h-8 text-primary-foreground" />}
      gradient="cool"
      backgroundImage={assets.heroPrivacy}
    />

    {/* Privacy Policy */}
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h2
          {...fadeIn()}
          className="text-3xl font-heading font-bold text-center mb-10 text-foreground"
        >
          Privacy Policy
        </motion.h2>

        <div className="space-y-6">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              {...slideInLeft(i)}
              className="rounded-xl bg-card border border-border p-6 flex gap-4 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-sky flex items-center justify-center shrink-0">
                <span className="text-sky-foreground">{s.icon}</span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-base mb-1 text-foreground">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Ethics */}
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div {...fadeIn()} className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold mb-4 text-foreground">
            Our Ethical Framework
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            We are committed to the highest ethical standards in everything we
            do.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ethicsPrinciples.map((p, i) => (
            <motion.div
              key={p.title}
              {...fadeInUpOnViewWithDelay(i, 0.1)}
              className="rounded-xl bg-mint/30 border border-mint p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-heading font-bold text-base mb-2 text-foreground">
                {p.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Contact */}
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <motion.div {...fadeInUpOnViewWithDelay(0)}>
          <h2 className="text-2xl font-heading font-bold mb-4 text-foreground">
            Questions About Your Data?
          </h2>

          <p className="text-muted-foreground mb-2">
            Contact our Data Protection Officer:
          </p>

          <p className="text-sm text-primary font-medium">
            dpo@brightminds.org
          </p>
        </motion.div>
      </div>
    </section>
  </PageTransition>
);

export default PrivacyPage;