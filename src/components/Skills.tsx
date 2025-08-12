
import { motion, animate } from "framer-motion";
import { useState } from "react";

const skills = [
  { name: "React", level: 90 },
  { name: "TypeScript", level: 88 },
  { name: "Node.js", level: 85 },
  { name: "Adobe Photoshop", level: 95 },
  { name: "Adobe Illustrator", level: 92 },
  { name: "Adobe XD", level: 88 },
  { name: "Figma", level: 90 },
  { name: "UI/UX Design", level: 85 },
  { name: "Web Design", level: 88 },
  { name: "Logo Design", level: 90 },
];

const SkillItem = ({ name, level, index }: { name: string; level: number; index: number }) => {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  const handleEnter = () => {
    if (started) return;
    setStarted(true);
    animate(0, level, {
      duration: 1,
      delay: 0.5,
      ease: 'easeInOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="mb-6"
      onViewportEnter={handleEnter}
    >
      <div className="flex justify-between mb-2">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground">{display}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
        />
      </div>
    </motion.div>
  );
};

export const Skills = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Skills & Expertise</h2>
          <p className="text-muted-foreground">Technologies and tools I work with</p>
        </motion.div>
        <div className="max-w-3xl mx-auto">
          {skills.map((skill, index) => (
            <SkillItem key={skill.name} name={skill.name} level={skill.level} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
