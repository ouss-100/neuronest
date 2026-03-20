"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { milestones, stats, stories } from "@/assets/assets";
import { fadeUp } from "@/lib/animations";

const OurImpact = () => (
  <div>
    <section className="section-spacer">
      <div className="container-narrow text-center">
        <motion.div {...fadeUp}>
          <div className="badge-active inline-flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4" />
            <span>Making a difference</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
            Every child deserves to be{" "}
            <span className="text-primary">understood</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Since our launch, LearnBright has helped thousands of families
            detect learning disorders early, connect with specialists, and
            unlock their children's potential.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="pb-20">
      <div className="container-narrow">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="card-soft text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-spacer bg-card">
      <div className="container-narrow">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Our journey so far
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Key milestones that shaped LearnBright.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-0">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 + 0.2 }}
              className="flex gap-6 relative"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-xs shrink-0 z-10">
                  {m.year.slice(2)}
                </div>
                {i < milestones.length - 1 && (
                  <div className="w-0.5 flex-1 bg-border" />
                )}
              </div>
              <div className="pb-10">
                <p className="text-xs font-bold text-primary mb-1">{m.year}</p>
                <h3 className="font-heading font-bold text-foreground mb-1">
                  {m.title}
                </h3>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-spacer">
      <div className="container-narrow">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Real stories, real impact
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Behind every assessment is a child who deserves to thrive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="card-soft-hover"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground text-sm">
                    {s.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.age}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {s.text}
              </p>
              <div className="flex items-center gap-2 text-secondary text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                {s.outcome}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-spacer bg-card">
      <div className="container-narrow text-center">
        <motion.div {...fadeUp}>
          <Award className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Be part of the change
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Join thousands of families taking the first step toward
            understanding their child's unique learning style.
          </p>
          <Link
            href="/register"
            className="btn-accent inline-flex items-center gap-2 text-lg"
          >
            Start Free Assessment <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  </div>
);

export default OurImpact;
