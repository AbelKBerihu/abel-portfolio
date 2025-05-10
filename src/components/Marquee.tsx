
import { motion } from "framer-motion";
import {
  Code,
  Film,
  Laptop,
  Youtube,
  Play,
  Layers,
  Database,
  Monitor,
  Figma,
  Globe,
} from "lucide-react";

const tools = [
  { name: "React", icon: Code, type: "dev" },
  { name: "TypeScript", icon: Laptop, type: "dev" },
  { name: "Node.js", icon: Database, type: "dev" },
  { name: "Next.js", icon: Globe, type: "dev" },
  { name: "Adobe Premiere", icon: Film, type: "video" },
  { name: "After Effects", icon: Play, type: "video" },
  { name: "DaVinci Resolve", icon: Monitor, type: "video" },
  { name: "Final Cut Pro", icon: Youtube, type: "video" },
  { name: "Figma", icon: Figma, type: "design" },
  { name: "Adobe XD", icon: Layers, type: "design" },
];

export const Marquee = () => {
  return (
    <div className="py-3 bg-secondary/20 overflow-hidden">
      <div className="flex">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          {[...tools, ...tools].map((tool, index) => (
            <motion.div
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm border"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.2,
                delay: index * 0.05 
              }}
            >
              {tool.icon && <tool.icon className="w-4 h-4" />}
              <span className="text-sm">{tool.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
