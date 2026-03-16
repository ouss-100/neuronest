"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqs } from "@/assets/assets";
import { fadeUp } from "@/lib/animations";

const Contact = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* Contact Section */}
      <section className="section-spacer">
        <div className="container-narrow">
          {/* Header */}
          <motion.div {...fadeUp()} className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
              Have a question or need support? We're here to help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div {...fadeUp()} className="card-soft !p-8">
              <h2 className="font-heading font-bold text-xl text-foreground mb-6">
                Send us a message
              </h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input className="input-soft" placeholder="First name" />
                  <input className="input-soft" placeholder="Last name" />
                </div>
                <input
                  className="input-soft"
                  type="email"
                  placeholder="Email address"
                />
                <select className="input-soft">
                  <option>I'm a parent</option>
                  <option>I'm a healthcare professional</option>
                  <option>I'm an educator</option>
                  <option>Other</option>
                </select>
                <textarea
                  className="input-soft min-h-[120px] resize-none"
                  placeholder="How can we help?"
                />
                <button type="submit" className="btn-accent w-full">
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Info Section */}
            <motion.div {...fadeUp()} className="space-y-8">
              {[
                { icon: Mail, label: "support@learnbright.com" },
                { icon: Phone, label: "+1 (555) 123-4567" },
                { icon: MapPin, label: "San Francisco, CA" },
              ].map((info) => (
                <div key={info.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <span className="text-foreground font-medium text-sm">
                    {info.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h2 {...fadeUp()} className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="card-soft !p-0 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="font-heading font-semibold text-sm text-foreground">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-4 pb-4"
                  >
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;