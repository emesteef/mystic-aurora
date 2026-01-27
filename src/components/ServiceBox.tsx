import { LucideIcon } from "lucide-react";

interface ServiceBoxProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: string;
  accentColor?: "purple" | "gold" | "teal" | "rose";
}

const accentStyles = {
  purple: {
    iconBg: "from-purple-500/30 to-violet-600/20",
    iconGlow: "shadow-purple-500/30",
    hoverBorder: "group-hover:border-purple-400/50",
    iconColor: "text-purple-300",
    titleHover: "group-hover:text-purple-300",
  },
  gold: {
    iconBg: "from-amber-400/30 to-yellow-500/20",
    iconGlow: "shadow-amber-400/30",
    hoverBorder: "group-hover:border-amber-400/50",
    iconColor: "text-amber-300",
    titleHover: "group-hover:text-amber-300",
  },
  teal: {
    iconBg: "from-teal-400/30 to-emerald-500/20",
    iconGlow: "shadow-teal-400/30",
    hoverBorder: "group-hover:border-teal-400/50",
    iconColor: "text-teal-300",
    titleHover: "group-hover:text-teal-300",
  },
  rose: {
    iconBg: "from-rose-400/30 to-pink-500/20",
    iconGlow: "shadow-rose-400/30",
    hoverBorder: "group-hover:border-rose-400/50",
    iconColor: "text-rose-300",
    titleHover: "group-hover:text-rose-300",
  },
};

const ServiceBox = ({ icon: Icon, title, description, delay = "0", accentColor = "purple" }: ServiceBoxProps) => {
  const styles = accentStyles[accentColor];
  
  return (
    <div 
      className={`group relative p-6 md:p-8 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 transition-all duration-500 animate-fade-in-up opacity-0 cursor-pointer ${styles.hoverBorder} overflow-hidden`}
      style={{ animationDelay: delay }}
    >
      {/* Glassmorphism inner glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Vertical accent line - spiritual element */}
      <div className={`absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-gradient-to-b from-transparent ${styles.iconBg.includes('purple') ? 'via-purple-400/60' : styles.iconBg.includes('amber') ? 'via-amber-400/60' : styles.iconBg.includes('teal') ? 'via-teal-400/60' : 'via-rose-400/60'} to-transparent opacity-60 group-hover:opacity-100 group-hover:top-[10%] group-hover:bottom-[10%] transition-all duration-700`} />
      
      {/* Animated background glow - stronger on hover */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${styles.iconBg} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
      
      {/* Golden rune/symbol in corner */}
      <div className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity duration-300">
        <div className="w-2 h-2 rounded-full bg-accent/80 shadow-lg shadow-accent/50" />
        <div className="absolute w-4 h-4 rounded-full border border-accent/30 animate-pulse" />
      </div>
      
      {/* Sparkle effects */}
      <div className="absolute top-8 right-12 w-1 h-1 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-6 right-6 w-1.5 h-1.5 rounded-full bg-accent/40 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-700" />
      
      {/* Icon container with enhanced glow */}
      <div className={`relative mb-6 w-16 h-16 rounded-xl bg-gradient-to-br ${styles.iconBg} flex items-center justify-center group-hover:scale-110 shadow-lg ${styles.iconGlow} group-hover:shadow-xl transition-all duration-300`}>
        <Icon className={`w-8 h-8 ${styles.iconColor} drop-shadow-lg`} />
        {/* Icon ring with glow */}
        <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-colors duration-300" />
        <div className={`absolute -inset-1 rounded-xl bg-gradient-to-br ${styles.iconBg} opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-500`} />
      </div>
      
      {/* Content */}
      <h3 className={`relative text-xl md:text-2xl font-heading font-medium text-foreground mb-3 transition-colors duration-300 ${styles.titleHover}`}>
        {title}
      </h3>
      
      <p className="relative text-muted-foreground text-sm md:text-base leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
        {description}
      </p>
      
      {/* Bottom decorative line - stronger */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent group-hover:w-3/4 group-hover:via-accent/70 transition-all duration-500" />
    </div>
  );
};

export default ServiceBox;
