import { Github, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const navLinks = [
    { label: "Home", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="flex items-center gap-2 px-2 py-2 rounded-full bg-gray-600/20 backdrop-blur-xl border border-border/20">
        {/* Logo */}
        <a
          href="#"
          className="px-4 py-2 text-lg 2xl:text-2xl font-bold text-white hover:opacity-90 transition-all">
          Sahid<span className="text-inherit">.</span>
        </a>

        {/* Nav Links */}
        <div className="hidden text-white md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm 2xl:text-lg font-medium text-muted-foreground hover:text-white hover:bg-linear-to-r from-[#8001ff] to-[#9832ff] rounded-full transition-all duration-300">
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-2">
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full hover:bg-zinc-900 hover:text-white hover:border-[0.5px] border-gray-700"
            asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer">
              <Github className="w-4 h-4 2xl:w-5 2xl:h-5" />
              <span className="hidden sm:inline bg-text-colour 2xl:text-lg">GitHub</span>
            </a>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="rounded-full gradient-download text-white hover:opacity-90 border-0">
            <Download className="w-4 h-4 2xl:w-5 2xl:h-5" />
            <span className="hidden sm:inline 2xl:text-lg">Download CV</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
