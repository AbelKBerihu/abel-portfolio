
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 right-4 z-50"
    >
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="p-2 rounded-full transition-transform hover:scale-110 cursor-none"
      >
        {theme === 'dark' ? (
          <Sun className="h-[1.2rem] w-[1.2rem] text-white" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] text-black" />
        )}
        <span className="sr-only">Toggle theme</span>
      </button>
    </motion.div>
  );
};
