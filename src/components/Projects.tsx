
import { motion } from "framer-motion";
import { Code, Film, Globe, ShoppingBag, Music, Coffee } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A modern e-commerce solution built with React and Node.js",
    type: "web",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    icon: ShoppingBag,
  },
  {
    title: "Brand Campaign",
    description: "Cinematic video production for a major brand",
    type: "video",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    icon: Film,
  },
  {
    title: "Music Streaming App",
    description: "A Spotify-like music streaming platform",
    type: "web",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    icon: Music,
  },
  {
    title: "Restaurant Website",
    description: "Modern website with online ordering system",
    type: "web",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    icon: Coffee,
  },
  {
    title: "Portfolio Platform",
    description: "Showcase platform for creative professionals",
    type: "web",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    icon: Globe,
  },
  {
    title: "Social Network",
    description: "Community platform with real-time features",
    type: "web",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    icon: Code,
  },
];

export const Projects = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
          <p className="text-muted-foreground">Some of my recent work</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center p-6">
                  <div className="mb-4">
                    {project.type === "web" ? (
                      <Code className="w-8 h-8 mx-auto" />
                    ) : (
                      <Film className="w-8 h-8 mx-auto" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-300">{project.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
