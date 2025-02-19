
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="bg-background min-h-screen">
      <Hero />
      <Projects />
      <Skills />
      <Contact />
    </div>
  );
};

export default Index;
