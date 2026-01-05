import ProcessCard from "./ProcessCard";

const processSteps = [
  {
    step: 1,
    title: "Discovery & Planning",
    description:
      "I start by understanding your idea, business goals, and target users. This helps define clear requirements, features, and a realistic roadmap before development begins.",
    outcomes: ["Clear project scope", "Defined goals", "Reduced risk and confusion"],
  },
  {
    step: 2,
    title: "UI/UX Design",
    description:
      "I design clean, user-friendly interfaces that focus on usability and brand consistency. Wireframes and UI designs are shared early for feedback and iteration.",
    outcomes: ["Intuitive user experience", "Modern, responsive UI", "Early validation through feedback"],
  },
  {
    step: 3,
    title: "Development & Integration",
    description:
      "Using the MERN stack, I build scalable, high-performance applications with clean code, reusable components, and secure APIs.",
    outcomes: ["Fast, scalable web application", "Clean frontend & backend architecture", "Optimized performance"],
  },
  {
    step: 4,
    title: "Testing & Launch",
    description:
      "Before launch, the product is tested across devices and browsers. After deployment, I provide support, fixes, and improvements as needed.",
    outcomes: ["Bug-free deployment", "Smooth launch", "Long-term reliability"],
  },
];

const WorkProcess = () => {
  return (
    <section className="relative py-20 lg:py-32 px-6 lg:px-12 bg-zinc-950 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            My Work Process
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            From idea to launch a simple, transparent workflow to build impactful digital products.
          </p>
        </div>

        {/* Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {processSteps.map((step, index) => (
            <div
              key={step.step}
              className={index % 2 === 0 ? "lg:mt-0" : "lg:mt-16"}
            >
              <ProcessCard
                step={step.step}
                title={step.title}
                description={step.description}
                outcomes={step.outcomes}
                delay={index * 150}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 lg:mt-20">
          <button className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-600/25">
            Let's Work Together
          </button>
        </div>
      </div>
    </section>
  );
};

export default WorkProcess;
