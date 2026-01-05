"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Highlighter } from "./ui/highlighter";

const experiences = [
  {
    id: 1,
    company: "CrevoSys",
    role: "Founder & CEO",
    designation: "UI Designer & MERN Stack Developer",
    duration: "2024 – Present",
    type: "Full-time",
    description: [
      "Leading CrevoSys as a digital product and development initiative",
      "Designing user-focused, modern UI/UX for web applications",
      "Building full-stack applications using the MERN stack",
      "Managing projects, development workflow, and delivery",
    ],
    logoInitial: "/crevosys.jpg",
    logoColor: "bg-blue-600",
  },
  {
    id: 2,
    company: "Tabbed IO (UK)",
    role: "Junior Full Stack Developer",
    duration: "January 2025 – June 2025",
    type: "6 Months Contract ",
    type2:"Remote",
    description: [
      "Worked with a UK-based team as a junior full stack developer",
      "Contributed to frontend and backend development tasks",
      "Integrated APIs and maintained application features",
      "Collaborated remotely with designers and senior developers",
    ],
    logoInitial: "/tabbed_io.png",
    logoColor: "bg-emerald-600",
  },
];

const Experience = () => {
  return (
    <section className="relative container mx-auto py-10" id="experience">
      {/* Background gradients */}
      <div className="absolute top-0 right-0  h-96 bg-violet-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 bg-blue-600/5 rounded-full blur-3xl opacity-50" />

      <div className=" mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl lg:text-5xl font-heading tracking-wide text-white mb-6">
              <Highlighter action="underline">Experience</Highlighter>
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
              A brief overview of my professional journey so far.
            </p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group relative h-full"
              >
                  {/* Card Background & Border Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-tr from-violet-600/20 to-blue-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                  
                  <div className="relative h-full bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors duration-300 flex flex-col">
                    {/* Header: Logo & Role */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            {exp.logoInitial.startsWith("/") ? (
                          <Image
                            src={exp.logoInitial}
                            alt={exp.company}
                            width={50}
                            height={50}
                            className="rounded-2xl"
                          />
                        ) : (
                          <div
                            className={`w-[50px] h-[50px] rounded-2xl flex items-center justify-center text-xl font-bold text-white ${exp.logoColor}`}
                          >
                            {exp.logoInitial}
                          </div>
                        )}
                            <div>
                            <h3 className="text-xl font-bold text-white leading-tight">
                                {exp.company}
                            </h3>
                            <p className="text-violet-400 font-medium text-sm mt-1">
                                {exp.type}
                            </p>
                            </div>
                        </div>
                         {/* Date Tag - Top Right on Desktop */}
                         <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-300 whitespace-nowrap">
                            <Calendar className="w-3.5 h-3.5" />
                            {exp.duration}
                        </div>
                    </div>

                    {/* Mobile Date Tag (shown below header on mobile) */}
                    <div className="sm:hidden flex items-center gap-2 px-3 py-1.5 mb-6 w-fit rounded-full bg-white/5 border border-white/5 text-xs text-zinc-300">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.duration}
                    </div>

                    {/* Role Details */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-zinc-200">
                            {exp.role}
                        </h4>
                        {exp.designation && (
                            <p className="text-zinc-400 text-sm italic mt-1">
                                {exp.designation}
                            </p>
                        )}
                    </div>

                    {/* Description Points */}
                    <ul className="space-y-3 mb-2 flex-grow">
                      {exp.description.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                          <span className="text-zinc-400 text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                  </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
