"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { articles } from "@/assets/assets";
import { fadeUp } from "@/lib/animations";

const Resources = () => (
  <div>
    <section className="section-spacer">
      <div className="container-narrow">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground">
            Resources & Guides
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
            Expert-curated articles and tips to help you understand and support
            your child's learning journey.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {["All", "Guides", "Articles", "Tips"].map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full font-heading font-semibold text-sm transition-all ${
                cat === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a, i) => (
            <motion.article
              key={a.title}
              {...fadeUp(i)}
              className="card-soft-hover cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-active text-xs">{a.category}</span>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {a.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{a.desc}</p>
              <span className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Read more <ArrowRight className="w-4 h-4" />
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Resources;
