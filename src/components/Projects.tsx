import { motion } from "framer-motion";
import { Code, Film, Globe, ShoppingBag, Music, Coffee, Star, Layers, Palette } from "lucide-react";

const projects = [
  {
    title: "Brand Identity Design",
    description: "Complete brand identity design including logo, color palette, typography, and brand guidelines for a tech startup.",
    type: "design",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    icon: Palette,
    rating: 4.9,
    comments: [
      {
        name: "Sarah Johnson",
        comment: "Exceptional brand design that perfectly captures our company vision.",
        rating: 5
      }
    ]
  },
  {
    title: "E-Commerce Platform",
    description: "Modern e-commerce website with custom product showcase, real-time inventory, and integrated payment processing.",
    type: "web",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    icon: ShoppingBag,
    rating: 4.8,
    comments: [
      {
        name: "David Chen",
        comment: "The UI design and functionality exceeded our expectations.",
        rating: 5
      }
    ]
  },
  {
    title: "UI/UX Design System",
    description: "Comprehensive design system including components, patterns, and guidelines for a large-scale web application.",
    type: "design",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    icon: Layers,
    rating: 4.7,
    comments: [
      {
        name: "Alex Turner",
        comment: "The design system greatly improved our development workflow!",
        rating: 4.5
      }
    ]
  },
  {
    title: "Portfolio Website",
    description: "Custom portfolio website with interactive animations and responsive design for a professional photographer.",
    type: "web",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    icon: Globe,
    rating: 4.8,
    comments: [
      {
        name: "Emma Davis",
        comment: "Beautiful design and smooth performance.",
        rating: 5
      }
    ]
  }
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg"
            >
              <motion.div 
                className="aspect-video overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-6 text-white h-full overflow-y-auto">
                  <div className="mb-4">
                    <project.icon className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(project.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm">{project.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Client Reviews</h4>
                    {project.comments.map((comment, i) => (
                      <div key={i} className="border-t border-white/20 pt-4">
                        <p className="italic text-sm mb-2">"{comment.comment}"</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">{comment.name}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(comment.rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-400"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
