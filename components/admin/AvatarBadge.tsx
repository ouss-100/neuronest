interface AvatarBadgeProps {
  name: string;
  color?: "primary" | "secondary" | "accent";
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
};

const AvatarBadge = ({ name, color = "primary" }: AvatarBadgeProps) => (
  <div className={`w-10 h-10 rounded-xl font-heading font-bold text-sm flex items-center justify-center shrink-0 ${colorMap[color]}`}>
    {name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
  </div>
);

export default AvatarBadge;
