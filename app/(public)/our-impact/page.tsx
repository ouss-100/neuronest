"use client";

import { Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import PageHero from "@/components/PageHero";
import { assets, articles } from "@/assets/assets";
import { fadeInUpOnViewWithDelay } from "@/lib/animations";

const NewsPage = () => (
  <PageTransition>
    {/* Hero */}
    <PageHero
      title="Latest News"
      subtitle="Stay informed with the latest developments in learning support."
      icon={<Newspaper className="w-8 h-8 text-primary-foreground" />}
      gradient="warm"
      backgroundImage={assets.heroNews}
    />

    {/* Articles */}
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        {articles.map((a, i) => (
          <motion.article
            key={a.title}
            {...fadeInUpOnViewWithDelay(i, 0.1)}
            className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-medium text-primary">
              {a.date}
            </span>

            <h3 className="font-heading font-bold text-lg mt-1 mb-2 text-foreground">
              {a.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {a.excerpt}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  </PageTransition>
);

export default NewsPage;