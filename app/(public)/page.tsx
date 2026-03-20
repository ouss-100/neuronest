"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { images, features, steps } from "@/assets/assets";
import { fadeUp, scaleFadeIn } from "@/lib/animations";

const Home = () => (
  <div>
    <section className="relative min-h-[85vh] flex items-center px-6 overflow-hidden">
      <div className="container-narrow grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUp()}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight">
            Understanding their <span className="text-primary">unique</span> way
            of learning.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            An AI-powered screening tool designed to help parents and doctors
            identify learning disorders early, with compassion and clarity.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="btn-accent inline-flex items-center gap-2"
            >
              Start Assessment <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/about" className="btn-outline-primary">
              How it works
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-secondary" /> Free screening
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-secondary" /> 5 min
              assessment
            </span>
          </div>
        </motion.div>

        <motion.div {...scaleFadeIn} className="relative">
          <div className="relative aspect-square bg-primary/5 rounded-[60px] flex items-center justify-center">
            <Image
              src={images.heroIllustration}
              alt="Children learning together"
              className="w-4/5 h-4/5 object-contain animate-float"
            />
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full blur-xl" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-secondary/20 rounded-full blur-xl" />
          </div>
        </motion.div>
      </div>
    </section>

    <section className="section-spacer bg-card">
      <div className="container-narrow">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
            How the detection process works
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            A simple, friendly journey from assessment to actionable insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              {...fadeUp(i)}
              className="card-soft-hover text-center p-6 rounded-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex flex-col items-center justify-center mx-auto mb-2">
                <step.icon className="w-6 h-6 mb-1" />
              </div>
              <span className="text-xs font-semibold text-primary">
                Step {i + 1}
              </span>
              <h3 className="font-heading font-bold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-spacer">
      <div className="container-narrow">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Built with care, backed by science
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Every feature is designed to make the screening process safe,
            accurate, and stress-free.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp(i)}
              className="card-soft-hover flex gap-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <f.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-spacer">
      <div className="container-narrow text-center">
        <motion.div {...fadeUp()}>
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Ready to discover how they learn best?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            84% of parents felt more confident after their first assessment.
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

export default Home;
