import { useEffect, useRef, useState } from "react";

interface ProcessCardProps {
  step: number;
  title: string;
  description: string;
  outcomes: string[];
  delay?: number;
}

const ProcessCard = ({ step, title, description, outcomes, delay = 0 }: ProcessCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group cursor-pointer hover:-translate-y-2 transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Step indicator */}
      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm font-bold">
        {step}
      </div>

      {/* Icon */}
      <div className="w-12 h-12 rounded-full border-2 border-zinc-700 flex items-center justify-center mb-6">
        <div className="w-3 h-3 rounded-full bg-violet-500 group-hover:scale-125 transition-transform duration-300" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-4">
        {title}
      </h3>

      {/* Description */}
      <p className="text-zinc-400 text-sm leading-relaxed mb-6">
        {description}
      </p>

      {/* Outcomes */}
      <div className="space-y-2">
        {outcomes.map((outcome, index) => (
          <div key={index} className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
            <span>{outcome}</span>
          </div>
        ))}
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default ProcessCard;
