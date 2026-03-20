"use client";

import { commitments, principles } from "@/assets/assets";
import { fadeUp } from "@/lib/animations";
import { motion } from "framer-motion";
import { Shield, AlertTriangle } from "lucide-react";

const PrivacyEthics = () => (
  <div>
    <section className="section-spacer">
      <div className="container-narrow text-center">
        <motion.div {...fadeUp}>
          <div className="w-16 h-16 rounded-[20px] bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
            Privacy & Ethics
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your family's privacy is not just a feature — it's our foundation.
            We believe every child's data deserves the highest protection and
            every assessment must be ethically sound.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="pb-20">
      <div className="container-narrow">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
            How we protect your family
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Six pillars that guide every decision we make about your data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="card-soft-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2">
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

    <section className="section-spacer bg-card">
      <div className="container-narrow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              Our commitments to you
            </h2>
            <p className="text-muted-foreground mb-8">
              These are promises we make to every family that trusts us with
              their child's information.
            </p>
            <ul className="space-y-4">
              {commitments.map((c, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-3.5 h-3.5 text-secondary" />
                  </div>
                  <span className="text-sm text-foreground">{c}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="card-soft p-8! bg-primary/5 border-primary/10">
              <AlertTriangle className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-heading font-bold text-foreground text-lg mb-3">
                Important notice
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                LearnBright provides{" "}
                <strong className="text-foreground">
                  screening assessments only
                </strong>
                . Our AI-powered tools are designed to identify potential
                indicators of learning disorders, but they are{" "}
                <strong className="text-foreground">
                  not a medical diagnosis
                </strong>
                .
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We always recommend consulting with qualified healthcare
                professionals for formal evaluation and diagnosis. Our platform
                facilitates — never replaces — expert care.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <section className="section-spacer">
      <div className="container-narrow text-center">
        <motion.div {...fadeUp}>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Your data rights
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-12">
            You're always in control. Here's what you can do with your data at
            any time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                title: "Access",
                desc: "View all data we hold about you and your child.",
              },
              {
                title: "Export",
                desc: "Download a complete copy of your data in standard formats.",
              },
              {
                title: "Delete",
                desc: "Request permanent deletion of all your data.",
              },
            ].map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="card-soft text-center"
              >
                <h3 className="font-heading font-bold text-primary text-lg mb-2">
                  {r.title}
                </h3>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  </div>
);

export default PrivacyEthics;
