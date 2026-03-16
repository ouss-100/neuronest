"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  color?: "primary" | "secondary" | "accent";
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  color = "primary",
}: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="card-soft flex items-start gap-4"
  >
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${colorMap[color]}`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
      {change && (
        <p className="text-xs text-secondary font-semibold mt-1">{change}</p>
      )}
    </div>
  </motion.div>
);

export default StatCard;
