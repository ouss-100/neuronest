"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { images, disorders, aiSteps } from "@/assets/assets";
import { Brain, HeartHandshake } from "lucide-react";
import { fadeUp } from "@/lib/animations";

const About = () => (
  <div>
    <section className="section-spacer">
      <div className="container-narrow grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div {...fadeUp()}>
          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground leading-tight">
            Our mission is <span className="text-primary">early detection</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            LearnBright uses AI-powered assessments to help identify learning
            disorders in children early, when intervention is most effective. We
            believe every child deserves to be understood.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-primary/5 rounded-[40px] p-8 flex items-center justify-center">
            <Image
              src={images.aboutIllustration}
              alt="Parent and child learning together"
              className="w-full max-w-sm"
            />
          </div>
        </motion.div>
      </div>
    </section>

    <section className="section-spacer bg-card">
      <div className="container-narrow">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Understanding Learning Disorders
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Learning disorders are neurological conditions that affect how the
            brain processes information. Early identification leads to better
            outcomes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {disorders.map((d, i) => (
            <motion.div
              key={d.title}
              {...fadeUp(i)}
              className="card-soft-hover"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <d.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2">
                {d.title}
              </h3>
              <p className="text-sm text-muted-foreground">{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            {...fadeUp()}
            className="w-16 h-16 rounded-2xl bg-bloom-periwinkle-light flex items-center justify-center mx-auto mb-6"
          >
            <HeartHandshake className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h2
            {...fadeUp()}
            className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6"
          >
            Our Mission
          </motion.h2>
          <motion.p
            {...fadeUp()}
            className="text-lg text-muted-foreground font-body leading-relaxed mb-4"
          >
            Every child deserves to learn in a way that works for them. Our
            mission is to make early screening accessible, affordable, and
            stress-free for families everywhere.
          </motion.p>
          <motion.p
            {...fadeUp()}
            className="text-lg text-muted-foreground font-body leading-relaxed"
          >
            By combining AI technology with expert knowledge, we bridge the gap
            between concern and action—helping parents understand their child's
            needs sooner.
          </motion.p>
        </motion.div>
      </div>
    </section>

    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            {...fadeUp()}
            className="w-16 h-16 rounded-2xl bg-bloom-mint-light flex items-center justify-center mx-auto mb-6"
          >
            <Brain className="w-8 h-8 text-secondary" />
          </motion.div>
          <motion.h2
            {...fadeUp()}
            className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6"
          >
            How Our AI Screening Works
          </motion.h2>

          <div className="space-y-4 text-left">
            {aiSteps.map((text, i) => (
              <motion.div
                key={i}
                {...fadeUp(i)}
                className="card-soft-hover flex gap-4 items-start"
              >
                <div className="w-8 h-8 rounded-full bg-bloom-periwinkle-light flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-display font-bold text-primary">
                    {i + 1}
                  </span>
                </div>
                <p className="text-muted-foreground font-body">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  </div>
);

export default About;
