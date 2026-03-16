"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Youtube,
  Twitter,
  Facebook,
} from "lucide-react";
import { useState } from "react";
import { faqs, contactInfo, socialIcons } from "@/assets/assets";

import { fadeUp } from "@/lib/animations";

const Contact = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* Contact Section */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div {...fadeUp()} className="card-soft p-5">
              <h2 className="font-heading font-bold text-xl text-foreground mb-5">
                Send us a message
              </h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input className="input-soft" placeholder="First name" />
                  <input className="input-soft" placeholder="Last name" />
                </div>
                <input
                  className="input-soft"
                  type="email"
                  placeholder="Email address"
                />
                <select className="input-soft" defaultValue="">
                  <option value="" disabled>
                    I am a...
                  </option>
                  <option>Parent</option>
                  <option>Healthcare professional</option>
                  <option>Educator</option>
                  <option>Other</option>
                </select>
                <textarea
                  className="input-soft min-h-[140px] resize-none"
                  placeholder="How can we help?"
                />
                <button type="submit" className="btn-accent w-full mt-2">
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              {...fadeUp()}
              className="flex flex-col justify-between py-8 lg:py-12"
            >
              <div className="space-y-8">
                <h2 className="font-heading font-bold text-xl text-foreground mb-8">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div
                      key={info.label}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <info.icon className="w-5 h-5" />
                      </div>
                      <span className="text-foreground font-medium">
                        {info.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-8">
                  <h3 className="font-heading font-semibold text-foreground mb-4">
                    Follow us
                  </h3>
                  <div className="flex gap-3">
                    {socialIcons.map(({ icon: Icon, url }, idx) => (
                      <motion.a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h2
            {...fadeUp()}
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center"
          >
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
